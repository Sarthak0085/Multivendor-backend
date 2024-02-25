import dotenv from "dotenv";
import mongoose, { Document, Model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";

dotenv.config();

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string; // Optional field
    addresses?: {
        country: string;
        state: string;
        city: string;
        address1: string;
        address2?: string; // Optional field
        pinCode: number;
        addressType: string;
    }[];
    role?: 'USER' | 'ADMIN';
    isBlock: boolean;
    avatar?: {
        public_id: string;
        url: string;
    };
    passwordResetToken?: string; // Optional field
    passwordResetExpires?: Date; // Optional field
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
    createPasswordResetToken: () => string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
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
            // required: true,
        },
        url: {
            type: String,
            // required: true,
        },
        // default: "https://res.cloudinary.com/dkzfopuco/image/upload/v1704392874/avatars/fgzkqxku7re8opvf8lsz.png",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
})

//hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 15);
    next();
});

//sign Access Token
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || '', {
        expiresIn: "5m"
    });
};

//sign Refresh Token
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || '', {
        expiresIn: "3d"
    });
};

//compare password 
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// reset password
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 //10mins

    return resetToken;
}

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;