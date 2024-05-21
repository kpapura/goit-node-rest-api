import { Schema, model } from "mongoose"
import {handleSaveError, setUpdateSetting} from "./hooks.js"
import {emailFormat} from "../constants/user-constants.js"
import { nanoid } from "nanoid";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: emailFormat,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
}, { versionKey: false, timestamps: true });

userSchema.pre("findOneAndUpdate", setUpdateSetting)

userSchema.post("save", handleSaveError)

userSchema.post("findOneAndUpdate", handleSaveError)

const User = model("user", userSchema)

export default User