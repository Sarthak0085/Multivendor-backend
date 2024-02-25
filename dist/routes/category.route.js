"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const category_controller_1 = require("../controllers/category.controller");
const user_controller_1 = require("../controllers/user.controller");
const categoryRouter = (0, express_1.Router)();
/*************** PUBLIC ROUTES *************/
// GET ALL CATEGORY
categoryRouter.get("/get-all", category_controller_1.getallCategory);
/****************** PROTECTED ADMIN ROUTES ************/
// ADD NEW CATEGORY BY ADMIN
categoryRouter.post("/admin-add", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, category_controller_1.addNewCategory);
// UPDATE CATEGORY
categoryRouter.put("/admin-update/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, category_controller_1.updateCategory);
// DELETE CATEGORY BY ADMIN
categoryRouter.delete("/admin-delete/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, category_controller_1.deleteCategory);
//GET ALL CATEGORY BY ADMIN
categoryRouter.get("/admin-get-all", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, category_controller_1.getallCategory);
//GET CATEGORY BY ID BY ADMIN
categoryRouter.get("/get/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, category_controller_1.getCategory);
exports.default = categoryRouter;
