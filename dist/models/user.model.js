"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Please enter your Full Name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?w+)*@\w+([\.-]?w+)*(\.\w{2,3})+$/,
            "Please add a valid Email"
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minLength: [8, "Password must be of 8 length"],
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/,
            "Password must contain atleast one uppercase, lowercase character, digit and special character",
        ],
        select: false,
    },
    phoneNumber: {
        type: String,
    },
    addresses: [
        {
            country: {
                type: String,
            },
            state: {
                type: String,
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {
                type: String,
            },
            pinCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        }
    ],
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER",
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    passwordResetToken: String,
    resetOtp: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
});
//hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 15);
    next();
});
//sign Access Token
userSchema.methods.SignAccessToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: "5m"
    });
};
//sign Refresh Token
userSchema.methods.SignRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
};
//compare password 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
// reset password token
userSchema.methods.createPasswordResetToken = function () {
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
        userId: this._id,
        otp: resetOtp,
        expiresIn: '10m'
    };
    const resetToken = jsonwebtoken_1.default.sign(payload, process.env.RESET_SECRET);
    this.passwordResetToken = resetToken;
    this.resetOtp = resetOtp;
    // this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return { resetToken, resetOtp };
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
