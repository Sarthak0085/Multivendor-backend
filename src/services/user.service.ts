import User from "../models/user.model"
import { Request, Response } from "express";

export const getUserById = async (id: string, res: Response) => {
    const user = await User.findById(id);
    res.status(201).json({
        success: true,
        user
    })
}

export const getUserByEmail = async (email: string) => {
    const user = await User.findOne({ email });
    return user;
}

export const getAllUsersService = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const users = await User.find({ _id: { $ne: userId } }).sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users
    })
}

export const updateUserRoleService = async (id: any, role: any, res: Response) => {
    const user = await User.findByIdAndUpdate(id, { role: role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    })
}