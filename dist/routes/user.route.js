"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/user.controller"));
const auth_1 = require("../middleware/auth");
const userRouter = (0, express_1.Router)();
/************** PRIVATE USER ROUTES ************/
//GET USER INFO
userRouter.get("/get-user", userController.updateAccessToken, auth_1.isAuthenticated, userController.getUser);
//UPDATE USER INFO
userRouter.put("/update-user-info", userController.updateAccessToken, auth_1.isAuthenticated, userController.updateUserInfo);
// UPDATE USER PASSWORD
userRouter.put("/update-password", userController.updateAccessToken, auth_1.isAuthenticated, userController.updatePassword);
// UPDATE USER AVATAR
userRouter.put("/update-avatar", userController.updateAccessToken, auth_1.isAuthenticated, userController.updateUserAvatar);
//UPDATE USER ADDRESS
userRouter.put("/update-user-address", userController.updateAccessToken, auth_1.isAuthenticated, userController.updateUserAddress);
//DELETE USER ADDRESS
userRouter.put("/delete-user-address/:id", userController.updateAccessToken, auth_1.isAuthenticated, userController.deleteUserAddress);
// GET USER INFO BY ID 
userRouter.get("/user-info/:id", userController.updateAccessToken, auth_1.isAuthenticated, userController.getUserInfoById);
/********************* ADMIN ROUTES **************/
// GET ALL USERS BY ADMIN
userRouter.get("/admin-all-users", userController.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, userController.getAllUsers);
// DELETE USER BY ADMIN
userRouter.delete("/admin-delete-user/:id", userController.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, userController.deleteUserById);
exports.default = userRouter;
