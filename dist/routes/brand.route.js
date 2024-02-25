"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../controllers/shop.controller");
const auth_1 = require("../middleware/auth");
const brand_controller_1 = require("../controllers/brand.controller");
const user_controller_1 = require("../controllers/user.controller");
const brandRouter = (0, express_1.Router)();
/*************** PUBLIC ROUTES *************/
// GET ALL BRANDS
brandRouter.get("/get-all", brand_controller_1.getallBrand);
/****************** PROTECTED ADMIN ROUTES ************/
// ADD NEW BRAND BY ADMIN
brandRouter.post("/admin-add", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, brand_controller_1.addNewBrand);
// UPDATE BRAND
brandRouter.put("/admin-update/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, brand_controller_1.updateBrand);
// DELETE BRAND BY ADMIN
brandRouter.delete("/admin-delete/:id", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, brand_controller_1.deleteBrand);
//GET ALL BRANDS BY ADMIN
brandRouter.get("/admin-get-all", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, brand_controller_1.getallBrand);
brandRouter.get("/get/:id", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, brand_controller_1.getBrand);
exports.default = brandRouter;
