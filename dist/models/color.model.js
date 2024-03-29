"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colorSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Color is required"],
    }
}, {
    timestamps: true,
});
const Color = mongoose_1.default.model("Color", colorSchema);
exports.default = Color;
