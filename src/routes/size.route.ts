import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import { addNewSize, deleteSize, getAllSizes } from "../controllers/size.controller";

const sizeRouter = Router();

/*************** PUBLIC ROUTES *************/

// GET ALL SIZES
sizeRouter.get("/get-all", getAllSizes);

/****************** PROTECTED ADMIN ROUTES ************/

// ADD NEW SIZE BY ADMIN
sizeRouter.post("/admin-add", updateAccessToken, isAuthenticated, isAdmin, addNewSize);

// DELETE SIZE BY ADMIN
sizeRouter.delete("/admin-delete/:id", updateAccessToken, isAuthenticated, isAdmin, deleteSize);

//GET ALL SIZE BY ADMIN
sizeRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getAllSizes);


export default sizeRouter;