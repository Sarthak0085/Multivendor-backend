"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const withdrawSchema = new mongoose_1.default.Schema({
    seller: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "Processing",
    },
}, { timestamps: true });
const Withdraw = mongoose_1.default.model("Withdraw", withdrawSchema);
exports.default = Withdraw;
