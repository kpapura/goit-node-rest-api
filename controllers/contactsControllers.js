import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../decorators/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const fields = "-createdAt -updatedAt";
  const { _id: owner } = req.user;
  const filter = { owner };

  if (req.query.favorite && req.query.favorite.toLowerCase() === "true") {
    filter.favorite = true;
  }

  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;
  const setting = { skip, limit };

  const contacts = await contactsService.listContacts({ filter, fields, setting });
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const contact = await contactsService.getContact({ owner, _id });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const deletedContact = await contactsService.removeContact({ owner, _id });
  if (!deletedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(deletedContact);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;

  const newContact = await contactsService.addContact({...req.body, owner});
  res.status(201).json(newContact);
};

export const updateContact = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const updatedContact = await contactsService.updateContact(
    { owner, _id },
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

export const updateStatusContact = async (req, res) => {
  const { favorite } = req.body;
  const { id: _id } = req.params;

  const user = await contactsService.getContact({ _id });

  if (favorite === user.favorite) {
    throw HttpError(404, "Favorite status is not valid");
  }
  const { _id: owner } = req.user;

  const updatedStatus = await contactsService.updateStatus(
    { owner, _id },
    req.body
  );
  if (!updatedStatus) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedStatus);
};
export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
