"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserByEmail = exports.getUserById = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getUserById = async (id, res) => {
    const user = await user_model_1.default.findById(id);
    res.status(201).json({
        success: true,
        user
    });
};
exports.getUserById = getUserById;
const getUserByEmail = async (email) => {
    const user = await user_model_1.default.findOne({ email });
    return user;
};
exports.getUserByEmail = getUserByEmail;
const getAllUsersService = async (req, res) => {
    const userId = req.user?._id;
    const users = await user_model_1.default.find({ _id: { $ne: userId } }).sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users
    });
};
exports.getAllUsersService = getAllUsersService;
const updateUserRoleService = async (id, role, res) => {
    const user = await user_model_1.default.findByIdAndUpdate(id, { role: role }, { new: true });
    res.status(201).json({
        success: true,
        user,
    });
};
exports.updateUserRoleService = updateUserRoleService;
