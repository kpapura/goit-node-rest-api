import express from "express";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js"
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js"
import isEmptyBody from "../middlewares/isEmptyBody.js";
import isValidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.post("/", isEmptyBody, validateBody(createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id", isValidId, isEmptyBody, validateBody(updateContactSchema), contactsControllers.updateContact);

contactsRouter.put("/:id/favorite", isValidId, isEmptyBody, contactsControllers.updateStatusContact);

export default contactsRouter;
