import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import { addNewColor, deleteColor, getAllColor } from "../controllers/color.controller";

const colorRouter = Router();

/*************** PUBLIC ROUTES *************/

// GET ALL COLOR
colorRouter.get("/get-all", getAllColor);

/****************** PROTECTED ADMIN ROUTES ************/

// ADD NEW COLOR BY ADMIN
colorRouter.post("/admin-add", updateAccessToken, isAuthenticated, isAdmin, addNewColor);

// DELETE COLOR BY ADMIN
colorRouter.delete("/admin-delete/:id", updateAccessToken, isAuthenticated, isAdmin, deleteColor);

//GET ALL COLOR BY ADMIN
colorRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getAllColor);


export default colorRouter;
