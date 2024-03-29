"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Declare the Schema of the Mongo model
var blogCategorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
}, {
    timestamps: true,
});
const BlogCategory = mongoose_1.default.model("BlogCategory", blogCategorySchema);
exports.default = BlogCategory;
