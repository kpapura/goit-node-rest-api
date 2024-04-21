import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await contactsService.removeContact(id);
  if (!deletedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(deletedContact);
};

export const createContact = async (req, res) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const updatedContact = await contactsService.updateContactById(id, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
};
