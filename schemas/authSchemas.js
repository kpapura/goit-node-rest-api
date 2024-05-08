import Joi from "joi";
import { emailFormat, typesOfSubscription } from "../constants/user-constants.js";

export const userSignupSchema = Joi.object({
  password: Joi.string().required("Password is required"),
  email: Joi.string().pattern(emailFormat).required("Email is required"),
  subscription: Joi.string().valid(...typesOfSubscription).default("starter"),
  token: Joi.string().default(null),
});

export const userSigninSchema = Joi.object({
  password: Joi.string().required("Password is required"),
  email: Joi.string().pattern(emailFormat).required("Email is required"),
});

export const userSubscriptionSchema = Joi.object({
  subscription: Joi.string().required("Subscription is required"),
});
