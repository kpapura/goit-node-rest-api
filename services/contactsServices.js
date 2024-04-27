import Contact from "../models/Contact.js";

export const listContacts = () => Contact.find();

export const addContact = (data) => Contact.create(data);

export const getContactById = async (contactId) => {
  const data = await Contact.findById({_id: contactId});
  return data;
};

export const updateContactById = async (id, data) => Contact.findByIdAndUpdate(id, data);

export const removeContact = async (contactId) => Contact.findByIdAndDelete(contactId);

export const updateStatusById = async (contactId, data) => Contact.findByIdAndUpdate(contactId, data)