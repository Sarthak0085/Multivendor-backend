"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shop_controller_1 = require("../controllers/shop.controller");
const auth_1 = require("../middleware/auth");
const product_controller_1 = require("../controllers/product.controller");
const user_controller_1 = require("../controllers/user.controller");
const productRouter = (0, express_1.Router)();
/***************** PUBLIC ROUTES ************/
// GET ALL PRODUCTS BY SHOP ID
productRouter.get("/get-all-products-shop/:id", product_controller_1.getAllProductsOfShopById);
// GET ALL PRODUCTS
productRouter.get("/get-all", product_controller_1.getAllProducts);
/***************** PRIVATE USER ROUTES ************/
// CREATE NEW REVIEW
productRouter.put("/create-new-review", user_controller_1.updateAccessToken, auth_1.isAuthenticated, product_controller_1.createReview);
/****************** PRIVATE SELLER ROUTES ***********/
// CREATE NEW PRODUCT BY SELLER
productRouter.post("/create", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, product_controller_1.createProduct);
// GET PRODUCT BY PRODUCT ID BY SELLER
productRouter.get("/get-product/:productId", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, product_controller_1.getProductById);
// UPDATE PRODUCT BY PRODUCT ID BY SELLER
productRouter.put("/update", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, product_controller_1.updateProduct);
// DELETE SHOP PRODUCT BY PRODUCT ID
productRouter.delete("/delete-shop-product/:id", shop_controller_1.updateSellerAccessToken, auth_1.isSeller, product_controller_1.deleteShopProduct);
/*************** ADMIN ROUTES **************/
// ADMIN GET ALL PRODUCTS
productRouter.get("/admin-get-all", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, product_controller_1.getAllProducts);
// ADMIN DELETE PRODUCT BY PRODUCT ID
productRouter.delete("/admin-delete/:productId", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, product_controller_1.adminDeleteProductById);
exports.default = productRouter;
