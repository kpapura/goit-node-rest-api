import User from "../models/Users.js"
import bcryptjs from "bcryptjs"

export const findUser = filter => User.findOne(filter)

export const signup = async (data) => {
    const { password } = data;
    const hashPassword = await bcryptjs.hash(password,10);
    return User.create({...data, password: hashPassword});
}

export const comparePassword = async (password, hashPassword) => bcryptjs.compare(password, hashPassword);

export const saveToken = (filter, data) => User.findOneAndUpdate(filter, data)

export const updateUser = async (filter, data) => User.findOneAndUpdate(filter, data)
    
export const changeAvatar = async (filter, data) => User.findOneAndUpdate(filter, {...data})
