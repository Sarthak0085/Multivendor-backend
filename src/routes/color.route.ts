import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import { addNewCategory, deleteCategory, getallCategory, updateCategory } from "../controllers/category.controller";
import { updateAccessToken } from "../controllers/user.controller";
import { addNewColor, deleteColor, getAllColor, updateColor } from "../controllers/color.controller";

const colorRouter = Router();

/*************** PUBLIC ROUTES *************/

// GET ALL COLOR
colorRouter.get("/get-all", getAllColor);

/****************** PROTECTED ADMIN ROUTES ************/

// ADD NEW CATEGORY BY ADMIN
colorRouter.post("/admin-add", updateAccessToken, isAuthenticated, isAdmin, addNewColor);

// UPDATE CATEGORY BY ADMIN
colorRouter.put("/admin-update/:id", updateAccessToken, isAuthenticated, isAdmin, updateColor);

// DELETE CATEGORY BY ADMIN
colorRouter.delete("/admin-delete/:id", updateAccessToken, isAuthenticated, isAdmin, deleteColor);

//GET ALL CATEGORY BY ADMIN
colorRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getAllColor);

// categoryRouter.get("/get/:id", updateSellerAccessToken, isSeller, getCategory);

export default colorRouter;
