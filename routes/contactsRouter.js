import express from "express";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js"
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js"
import isEmptyBody from "../middlewares/isEmptyBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", contactsControllers.getOneContact);

contactsRouter.delete("/:id", contactsControllers.deleteContact);

contactsRouter.post("/", isEmptyBody, validateBody(createContactSchema), contactsControllers.createContact);

contactsRouter.put("/:id", isEmptyBody, validateBody(updateContactSchema), contactsControllers.updateContact);

export default contactsRouter;
