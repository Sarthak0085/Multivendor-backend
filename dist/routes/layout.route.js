"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const layout_controller_1 = require("../controllers/layout.controller");
const user_controller_1 = require("../controllers/user.controller");
const layoutRouter = express_1.default.Router();
/************** PUBLIC ROUTES ***************/
// GET LAYOUT
layoutRouter.get("/get/:type", layout_controller_1.getLayout);
/***************** ADMIN ROUTES **************/
// CREATE LAYOUT BY ADMIN
layoutRouter.post("/create", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, layout_controller_1.createLayout);
// EDIT LAYOUT BY ADMIN
layoutRouter.put("/edit", user_controller_1.updateAccessToken, auth_1.isAuthenticated, auth_1.isAdmin, layout_controller_1.editLayout);
exports.default = layoutRouter;
