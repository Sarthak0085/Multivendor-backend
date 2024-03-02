import dotenv from "dotenv";
import mongoose, { Document, Model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";

interface ITransaction {
    amount: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IWithdraw {
    bankName: string;
    bankCountry: string;
    bankSwiftCode: string;
    bankAccountNumber: number;
    bankHolderName: string;
    bankAddress: string;
}

export interface IShop extends Document {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    description: string;
    address: string;
    role: string;
    avatar: {
        public_id: string;
        url: string;
    };
    pinCode: number;
    withdrawMethod: object;
    availableBalance: number;
    isBlock: boolean;
    transactions: ITransaction[];
    passwordResetToken?: string;
    resetOtp?: string;
    passwordResetExpires?: Date;
    SignAccessToken(): string;
    SignRefreshToken(): string;
    createPasswordResetToken(): string;
    comparePassword: (password: string) => Promise<boolean>;
    createdAt?: Date;
    updatedAt?: Date;
}

const shopSchema = new mongoose.Schema<IShop>({
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
shopSchema.pre<IShop>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 15);
    next();
});

//sign Access Token
shopSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.SELLER_ACCESS_TOKEN || '', {
        expiresIn: "5m"
    });
};

//sign Refresh Token
shopSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.SELLER_REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
};

//compare password 
shopSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};


// reset password
shopSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 //10mins

    return resetToken;
}

const Shop: Model<IShop> = mongoose.model("Shop", shopSchema);

export default Shop;