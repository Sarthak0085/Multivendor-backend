"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const dotenv_1 = require("dotenv");
const dbConnection_js_1 = require("./db/dbConnection.js");
const cloudinary_1 = require("cloudinary");
(0, dotenv_1.config)();
// cloudinary config
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
const port = Number(process.env.PORT) || 4000;
app_js_1.default.listen(port, () => {
    console.log(`The server is running on the port :${port}`);
    (0, dbConnection_js_1.connectToDatabase)();
});
