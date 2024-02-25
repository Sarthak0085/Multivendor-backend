import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth";
import { createLayout, editLayout, getLayout } from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

const layoutRouter = express.Router();

/************** PUBLIC ROUTES ***************/

// GET LAYOUT
layoutRouter.get("/get/:type", getLayout);

/***************** ADMIN ROUTES **************/

// CREATE LAYOUT BY ADMIN
layoutRouter.post("/create", updateAccessToken, isAuthenticated, isAdmin, createLayout);

// EDIT LAYOUT BY ADMIN
layoutRouter.put("/edit", updateAccessToken, isAuthenticated, isAdmin, editLayout);

export default layoutRouter;