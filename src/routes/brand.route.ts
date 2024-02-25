import { Router } from "express";
import { updateSellerAccessToken } from "../controllers/shop.controller";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth";
import { addNewBrand, deleteBrand, getBrand, getallBrand, updateBrand } from "../controllers/brand.controller";
import { updateAccessToken } from "../controllers/user.controller";

const brandRouter = Router();

/*************** PUBLIC ROUTES *************/

// GET ALL BRANDS
brandRouter.get("/get-all", getallBrand);

/****************** PROTECTED ADMIN ROUTES ************/

// ADD NEW BRAND BY ADMIN
brandRouter.post("/admin-add", updateAccessToken, isAuthenticated, isAdmin, addNewBrand);

// UPDATE BRAND
brandRouter.put("/admin-update/:id", updateAccessToken, isAuthenticated, isAdmin, updateBrand);

// DELETE BRAND BY ADMIN
brandRouter.delete("/admin-delete/:id", updateAccessToken, isAuthenticated, isAdmin, deleteBrand);

//GET ALL BRANDS BY ADMIN
brandRouter.get("/admin-get-all", updateAccessToken, isAuthenticated, isAdmin, getallBrand);

brandRouter.get("/get/:id", updateSellerAccessToken, isSeller, getBrand);

export default brandRouter;
