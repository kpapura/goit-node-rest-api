import Contact from "../models/Contact.js";

export const listContacts = ({ filter = {}, fields, setting = {} }) => Contact.find(filter, fields, setting).populate("owner", "email subscription");

export const addContact = (data) => Contact.create(data);

export const getContact = async (filter) => Contact.findOne(filter)

export const updateContact = async (filter, data) => Contact.findOneAndUpdate(filter, data);

export const removeContact = async (filter) => Contact.findOneAndDelete(filter);

export const updateStatus = async (filter, data) => Contact.findOneAndUpdate(filter, data)
