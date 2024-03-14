"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sizeSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, "Size Name is required"],
    },
    symbol: {
        type: String,
        required: [true, "Size Symbol is required"],
    },
}, {
    timestamps: true,
});
const Size = mongoose_1.default.model("Size", sizeSchema);
exports.default = Size;
