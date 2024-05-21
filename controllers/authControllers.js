import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
// import cloudinary from "../helpers/cloudinary.js"

import HttpError from "../helpers/HttpError.js";
import sendMail from "../helpers/sendEmail.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import * as authServices from "../services/authServices.js";
import { typesOfSubscription } from "../constants/user-constants.js";
import { resizeImages } from "../helpers/resizeImages.js";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  // const {url: avatar} = await cloudinary.uploader.upload(req.file.path, { folder: "avatars" });
  // await fs.unlink(req.file.path);

  const avatarURL = gravatar.url(req.body.email);
  const verificationToken = nanoid();

  const newUser = await authServices.signup({
    ...req.body,
    avatarURL,
    verificationToken,
  });
  const verificationMail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href='${BASE_URL}/api/auth/users/verify/${verificationToken}'>Click to verify</a>`,
  };

  await sendMail(verificationMail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });
  
  if (!user) {
    throw HttpError(404, "Not found");
  }
  await authServices.updateUser({ _id: user.id }, { verify: true, verificationToken: null });

  res.json({
    message: "Verification successful",
  });
};

const resendMail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "Missing required field email");
  }

  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verificationMail = {
    to: email,
    subject: "Verify email",
    html: `<a target='_blank' href='${BASE_URL}/api/auth/users/verify/${user.verificationToken}'>Click to verify</a>`,
  };
  await sendMail(verificationMail);

  res.json({
    message: "Verification email sent",
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  const passwordCompare = await authServices.comparePassword(
    password,
    user.password
  );
  if (!passwordCompare) {
    throw HttpError(401, "Password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authServices.saveToken({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.saveToken({ _id }, { token: "" });
  res.status(204).json();
};

const changeUserSubscription = async (req, res) => {
  const { subscription } = req.body;

  if (
    !typesOfSubscription.includes(subscription) ||
    subscription === req.user.subscription
  ) {
    throw HttpError(404, "Subscription is not valid");
  }
  const { _id } = req.user;
  const changedSubscription = await authServices.updateUser(
    { _id },
    subscription
  );

  if (!changedSubscription) {
    throw HttpError(404, "Not found");
  }
  res.json(changedSubscription);
};

const changeUserAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await resizeImages(oldPath, newPath);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  const changedAvatar = await authServices.changeAvatar({ _id }, { avatarURL });
  if (!changedAvatar) {
    throw HttpError(404, "Not found");
  }
  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendMail: ctrlWrapper(resendMail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  changeUserSubscription: ctrlWrapper(changeUserSubscription),
  changeUserAvatar: ctrlWrapper(changeUserAvatar),
};
