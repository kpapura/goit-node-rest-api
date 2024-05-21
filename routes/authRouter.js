import express from "express";

import authControllers from "../controllers/authControllers.js"
import {userSigninSchema, userSignupSchema, userSubscriptionSchema } from "../schemas/authSchemas.js"
import validateBody from "../helpers/validateBody.js"
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router()

// upload.fields([{name: "poster", maxCount: 1},{name: "subposter", maxCount: 3}])
// upload.array("poster", 8)

authRouter.post("/users/register", upload.single("avatarURL"), isEmptyBody, validateBody(userSignupSchema), authControllers.signup)
authRouter.post("/users/login", isEmptyBody, validateBody(userSigninSchema), authControllers.signin)
authRouter.get("/users/current", authenticate, authControllers.getCurrent)
authRouter.get("/users/logout", authenticate, authControllers.logout)
authRouter.patch("/users", authenticate, validateBody(userSubscriptionSchema), authControllers.changeUserSubscription)
authRouter.patch("/users/avatars", upload.single("avatarURL"), authenticate, authControllers.changeUserAvatar)

export default authRouter; 