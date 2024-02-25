import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import { addNewCategory, deleteCategory, getCategory, getallCategory, updateCategory } from "../controllers/category.controller";
import { updateAccessToken } from "../controllers/user.controller";

const categoryRouter = Router();

/*************** PUBLIC ROUTES *************/

// GET ALL CATEGORY
categoryRouter.get("/get-all", getallCategory);

/****************** PROTECTED ADMIN ROUTES ************/

// ADD NEW CATEGORY BY ADMIN
categoryRouter.post("/admin-add", updateAccessToken, isAuthenticated, isAdmin, addNewCategory);

// UPDATE CATEGORY
categoryRouter.put("/admin-update/:id", updateAccessToken, isAuthenticated, isAdmin, updateCategory);

// DELETE CATEGORY BY ADMIN
categoryRouter.delete("/admin-delete/:id", updateAccessToken, isAuthenticated, isAdmin, deleteCategory);

//GET ALL CATEGORY BY ADMIN
categoryRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getallCategory);

//GET CATEGORY BY ID BY ADMIN
categoryRouter.get("/get/:id", updateAccessToken, isAuthenticated, isAdmin, getCategory);

export default categoryRouter;
