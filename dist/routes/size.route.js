"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_controller_1 = require("../controllers/user.controller");
const size_controller_1 = require("../controllers/size.controller");
const sizeRouter = (0, express_1.Router)();
/*************** PUBLIC ROUTES *************/
// GET ALL SIZES
sizeRouter.get("/get-all", size_controller_1.getAllSizes);
/****************** PROTECTED ADMIN ROUTES ************/
// ADD NEW SIZE BY ADMIN
sizeRouter.post("/admin-add", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, size_controller_1.addNewSize);
// DELETE SIZE BY ADMIN
sizeRouter.delete("/admin-delete/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, size_controller_1.deleteSize);
//GET ALL SIZE BY ADMIN
sizeRouter.get("/admin-get-all", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, size_controller_1.getAllSizes);
exports.default = sizeRouter;
