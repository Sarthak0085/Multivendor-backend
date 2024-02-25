"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const color_controller_1 = require("../controllers/color.controller");
const colorRouter = (0, express_1.Router)();
/*************** PUBLIC ROUTES *************/
// GET ALL COLOR
colorRouter.get("/get-all", color_controller_1.getAllColor);
/****************** PROTECTED ADMIN ROUTES ************/
// ADD NEW CATEGORY BY ADMIN
colorRouter.post("/admin-add", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, color_controller_1.addNewColor);
// UPDATE CATEGORY BY ADMIN
colorRouter.put("/admin-update/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, color_controller_1.updateColor);
// DELETE CATEGORY BY ADMIN
colorRouter.delete("/admin-delete/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, color_controller_1.deleteColor);
//GET ALL CATEGORY BY ADMIN
colorRouter.get("/admin-get-all", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, color_controller_1.getAllColor);
// categoryRouter.get("/get/:id", updateSellerAccessToken, isSeller, getCategory);
exports.default = colorRouter;
