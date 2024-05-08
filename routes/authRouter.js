import express from "express";

import authControllers from "../controllers/authControllers.js"
import { userSigninSchema, userSignupSchema, userSubscriptionSchema } from "../schemas/authSchemas.js"
import validateBody from "../helpers/validateBody.js"
import isEmptyBody from "../middlewares/isEmptyBody.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router()

authRouter.post("/users/register", isEmptyBody, validateBody(userSignupSchema), authControllers.signup)
authRouter.post("/users/login", isEmptyBody, validateBody(userSigninSchema), authControllers.signin)
authRouter.get("/users/current", authenticate, authControllers.getCurrent)
authRouter.get("/users/logout", authenticate, authControllers.logout)
authRouter.patch("/users", authenticate, validateBody(userSubscriptionSchema), authControllers.changeUserSubscription)

export default authRouter; 