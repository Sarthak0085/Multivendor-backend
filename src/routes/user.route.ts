import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth";

const userRouter = Router();

/************** PRIVATE USER ROUTES ************/

//GET USER INFO
userRouter.get("/get-user", userController.updateAccessToken, isAuthenticated, userController.getUser);

//UPDATE USER INFO
userRouter.put("/update-user-info", userController.updateAccessToken, isAuthenticated, userController.updateUserInfo);

// UPDATE USER PASSWORD
userRouter.put("/update-password", userController.updateAccessToken, isAuthenticated, userController.updatePassword);

// UPDATE USER AVATAR
userRouter.put("/update-avatar", userController.updateAccessToken, isAuthenticated, userController.updateUserAvatar);

//UPDATE USER ADDRESS
userRouter.put("/update-user-address", userController.updateAccessToken, isAuthenticated, userController.updateUserAddress);

//DELETE USER ADDRESS
userRouter.put("/delete-user-address/:id", userController.updateAccessToken, isAuthenticated, userController.deleteUserAddress);

// GET USER INFO BY ID 
userRouter.get("/user-info/:id", userController.updateAccessToken, isAuthenticated, userController.getUserInfoById);

/********************* ADMIN ROUTES **************/

// GET ALL USERS BY ADMIN
userRouter.get("/admin-all-users", userController.updateAccessToken, isAuthenticated, isAdmin, userController.getAllUsers);

// BLOCK/ UNBLOCK OR UPDATE USER ROLE BY ADMIN
userRouter.put("/admin-update/:userId", userController.updateAccessToken, isAuthenticated, isAdmin, userController.updateUserByAdmin);

// DELETE USER BY ADMIN
userRouter.delete("/admin-delete-user/:id", userController.updateAccessToken, isAuthenticated, isAdmin, userController.deleteUserById);

export default userRouter;