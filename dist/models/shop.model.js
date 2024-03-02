"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const shopSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter your shop name!"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        // match: [/^\w+([\.-]?w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$/,
        //     "Please add a valid Email"
        // ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be of 8 length"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
            "Password must contain atleast one uppercase, lowercase character, digit and special character",
        ],
        select: false,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Seller",
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    pinCode: {
        type: Number,
        required: true,
    },
    withdrawMethod: {
        type: Object,
        ref: "Withdraw",
    },
    availableBalance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            amount: {
                type: Number,
                required: true,
            },
            status: {
                type: String,
                default: "Processing",
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
            updatedAt: {
                type: Date,
            },
        },
    ],
    passwordResetToken: String,
    resetOtp: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
});
//hash password before saving
shopSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 15);
    next();
});
//sign Access Token
shopSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.SELLER_ACCESS_TOKEN || '', {
        expiresIn: "5m"
    });
};
//sign Refresh Token
shopSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.SELLER_REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
};
//compare password 
shopSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
// reset password
shopSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10mins
    return resetToken;
};
const Shop = mongoose_1.default.model("Shop", shopSchema);
exports.default = Shop;
