import { Router } from "express";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import {
    createProduct,
    createReview,
    deleteShopProduct,
    getAllProducts,
    getAllProductsOfShopById,
    updateProduct
} from "../controllers/product.controller";
import { updateAccessToken } from "../controllers/user.controller";

const productRouter = Router();

/***************** PUBLIC ROUTES ************/

// GET ALL PRODUCTS BY SHOP ID
productRouter.get("/get-all-products-shop/:id", getAllProductsOfShopById);

// GET ALL PRODUCTS
productRouter.get("/get-all", getAllProducts);

/***************** PRIVATE USER ROUTES ************/

// CREATE NEW REVIEW
productRouter.put("/create-new-review", updateAccessToken, isAuthenticated, createReview);


/****************** PRIVATE SELLER ROUTES ***********/

// CREATE NEW PRODUCT BY SELLER
productRouter.post("/create", updateSellerAccessToken, isSeller, createProduct);

productRouter.put("/update/:productId", updateSellerAccessToken, isSeller, updateProduct);

// DELETE SHOP PRODUCT BY PRODUCT ID
productRouter.delete("/delete-shop-product/:id", updateSellerAccessToken, isSeller, deleteShopProduct);

/*************** ADMIN ROUTES **************/

// ADMIN GET ALL PRODUCTS
productRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getAllProducts);

export default productRouter;

