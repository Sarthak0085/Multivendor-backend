import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import sendEmail from "../utils/sendMail";
import ejs from "ejs";
import path from "path";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import Shop, { IShop } from "../models/shop.model";
import { sendShopToken } from "../utils/shopToken";

// register user
interface IRegistrationbody {
    name: string,
    email: string,
    password: string,
    address: string;
    phoneNumber: string;
    pinCode: number;
    avatar: string,
    description?: string;
}

// register shop
export const shopRegister = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, address, description, phoneNumber, pinCode, password, avatar } = req.body as IRegistrationbody;

        if (!name || name.trim() === "" || !email || email.trim() === "" ||
            !password || password.trim() === "" || !address || address.trim() === ""
            || !phoneNumber || phoneNumber.trim() === "" || !pinCode || !avatar || avatar === "") {
            return next(new ErrorHandler("Please fill all the details", 401));
        }


        const sellerEmail = await User.findOne({ email });

        if (sellerEmail) {
            return next(new ErrorHandler("Seller already exists", 400));
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "shop_avatars",
            width: 150
        });

        const seller = {
            name: name,
            email: email,
            password: password,
            address: address,
            phoneNumber: phoneNumber,
            pinCode: pinCode,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            description: description,
        };

        const activationToken = createActivationToken(seller);

        const activationCode = activationToken.activationCode;

        const data = { user: { name: seller.name }, activationCode };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activationMail.ejs"), data);

        try {
            await sendEmail({
                email: seller.email,
                subject: "Activate your account",
                template: "activationMail.ejs",
                data
            });


            res.status(201).json({
                success: true,
                message: `Thanks for registering ${seller.name}, Please check your email: ${seller.email} to activate your account.`,
                activationToken: activationToken.token
            })
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        };
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IActivationToken {
    activationCode: string;
    token: string;
}

// create activation token
export const createActivationToken = (seller: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({
        seller, activationCode
    }, process.env.SHOP_ACTIVATION_SECRET as Secret, {
        expiresIn: "5m"
    })

    return { activationCode, token };
}

interface IActivationRequest {
    activation_token: string,
    activation_code: string,
}

export const activateShop = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;

        if (!activation_token || activation_token === "" || !activation_code || activation_code === "") {
            return next(new ErrorHandler("Please fill all the details", 401));
        }

        const newSeller: { seller: IShop; activationCode: string } = jwt.verify(
            activation_token,
            process.env.SHOP_ACTIVATION_SECRET as string,
        ) as { seller: IShop; activationCode: string };

        if (newSeller.activationCode !== activation_code) {
            return next(new ErrorHandler('Invalid Activation Code', 400));
        }
        console.log(newSeller?.seller);

        const { name, email, password, description, address, phoneNumber, pinCode, avatar } = newSeller.seller;

        const existUser = await Shop.findOne({ email });

        if (existUser) {
            return next(new ErrorHandler("Email Already Exist", 400));
        }

        const shop = await Shop.create({
            name,
            email,
            password,
            address,
            phoneNumber,
            pinCode,
            avatar,
            description,
        });

        res.status(200).json({
            success: true,
            shop,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface ILoginRequest {
    email: string,
    password: string,
}

// login shop
export const loginShop = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide your email and password", 400));
        }

        const seller = await Shop.findOne({ email }).select("+password");

        if (!seller) {
            return next(new ErrorHandler("Shop not found.Please register first.", 404));
        }

        if (seller.isBlock) {
            return next(new ErrorHandler("This account has been blocked by admin.", 404));
        }

        const isPasswordMatched = await seller.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        sendShopToken(seller, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//logout shop
export const logoutShop = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("seller_access_token", "", { maxAge: 1 });
        res.cookie("seller_refresh_token", "", { maxAge: 1 });
        const sellerId = req.seller?._id || '';

        res.status(200).json({
            success: true,
            message: "Logout Successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// update access token
export const updateSellerAccessToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seller_refresh_token = req.cookies.seller_refresh_token as string;
        const decoded = jwt.verify(seller_refresh_token, process.env.SELLER_REFRESH_TOKEN as string) as JwtPayload;

        console.log("decoded: ", decoded);


        if (!decoded) {
            return next(new ErrorHandler("Could not refresh token", 400));
        }

        const session = await redis.get(`shop-${decoded.id}`);

        if (!session) {
            return next(new ErrorHandler("Please login to access this resource!", 400));
        }

        const seller = JSON.parse(session);
        req.seller = seller;

        console.log(req.seller);


        const accessToken = jwt.sign({ id: seller._id }, process.env.SELLER_ACCESS_TOKEN as string, { expiresIn: "5m" });

        const refreshToken = jwt.sign({ id: seller._id }, process.env.SELLER_REFRESH_TOKEN as string, { expiresIn: "3d" });

        res.cookie("seller_access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_access_token", refreshToken, refreshTokenOptions);

        await redis.set(`shop-${seller._id}:-`, JSON.stringify(seller), "EX", 604800); //expire after 7 days


        next();

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// load shop
export const getShop = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopData = await redis.get(`shop-${req?.seller?._id}:-`);

        if (shopData) {
            const seller = JSON.parse(shopData);
            res.status(200).json({
                success: true,
                seller,
            });
        } else {
            const seller = await Shop.findById(req?.seller._id);

            if (!seller) {
                return next(new ErrorHandler("Shop doesn't exists", 400));
            }
            res.status(200).json({
                success: true,
                seller,
            });
        }

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});



export const getShopInfoById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopData = await redis.get(`shop-${req?.params?.id}:-`);

        if (shopData) {
            const seller = JSON.parse(shopData);
            res.status(200).json({
                success: true,
                seller,
            });
        } else {
            const seller = await Shop.findById(req?.params?.id);

            if (!seller) {
                return next(new ErrorHandler("Shop doesn't exists", 400));
            }
            res.status(200).json({
                success: true,
                seller,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IupdateAvatar {
    avatar: string;
}

// // forgot password
export const forgotShopPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body

    const seller = await Shop.findOne({ email })

    if (!seller) {
        return next(new ErrorHandler("Seller Not found with this Email. Please Register first", 401));
    }

    const resetToken = createResetToken(seller);
    seller.save();
    const activationCode = resetToken.resetOtp;

    console.log("Reset: ", resetToken);

    const data = { user: { name: seller.name }, activationCode };

    const html = await ejs.renderFile(path.join(__dirname, "../mails/activationMail.ejs"), data);

    try {
        await sendEmail({
            email: seller.email,
            subject: "Reset Password",
            template: "resetMail.ejs",
            data
        });

        res.status(201).json({
            success: true,
            message: `Please check your email: ${seller.email} to reset your password.`,
            resetToken: resetToken.resetToken,
        })
    } catch (error: any) {
        seller.passwordResetToken = undefined
        seller.resetOtp = undefined;
        seller.save()
        console.log(error)

        return next(new ErrorHandler(error.message, 500));
    }
});

interface ICreateResetToken {
    resetOtp: string;
    resetToken: string;
    seller: IShop;
}

export const createResetToken = (seller: IShop): ICreateResetToken => {
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = jwt.sign({
        seller, resetOtp
    }, process.env.SHOP_RESET_SECRET as Secret, {
        expiresIn: "10m"
    });

    seller.passwordResetToken = resetToken;
    seller.resetOtp = resetOtp;
    seller.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return { resetOtp, resetToken, seller };
}

interface IResetPasswordRequest {
    reset_token: string;
    reset_otp: string;
    newPassword: string;
}

export const resetShopPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { reset_token, newPassword, reset_otp } = req.body as IResetPasswordRequest;

    if (!reset_token || reset_token === "") {
        return next(new ErrorHandler("Reset Token Expires", 404));
    }

    if (!reset_otp || reset_otp === "" || !newPassword || newPassword === "" || !reset_token || reset_token === "") {
        return next(new ErrorHandler("Please fill all the details", 401));
    }

    const payload: { seller: IShop; resetOtp: string; resetToken: string; } = jwt.verify(reset_token, process.env.SHOP_RESET_SECRET as string) as { seller: IShop; resetOtp: string; resetToken: string; };

    if (payload.resetOtp !== reset_otp) {
        return next(new ErrorHandler('Invalid OTP', 400));
    }

    const seller = await Shop.findById(payload.seller._id);

    if (!seller) {
        return next(new ErrorHandler('Seller not found', 404));
    }

    if (seller.passwordResetExpires === undefined) {
        return next(new ErrorHandler('Reset token has expired', 400));
    }

    try {
        seller.password = newPassword;

        seller.passwordResetToken = undefined;
        seller.passwordResetExpires = undefined;
        seller.resetOtp = undefined;

        await seller.save();

        await redis.set(`shop-${seller?._id}:-`, JSON.stringify(seller));

        res.status(200).json({
            success: true,
            message: 'Password Reset successful',
        });

    } catch (error: any) {
        seller.passwordResetToken = undefined;
        seller.passwordResetExpires = undefined;
        seller.resetOtp = undefined;
        seller.save();
        return next(new ErrorHandler(error.message, 400));
    }
});



export const updateShopAvatar = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body;
        const shopId = req.seller?._id;

        const seller = await Shop.findById(shopId);

        if (avatar === null) {
            return next(new ErrorHandler("Avatar not found", 400));
        }

        console.log(seller?.avatar.public_id);


        if (avatar && seller) {
            if (seller?.avatar.public_id) {
                await cloudinary.v2.uploader.destroy(seller?.avatar.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "shop_avatars",
                    width: 150
                });
                seller.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            } else {
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "shop_avatars",
                    width: 150
                });
                seller.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }
            }
        }

        console.log(seller?.avatar.public_id);


        if (!seller) {
            return next(new ErrorHandler("Shop not found", 404));
        }

        await seller.save();

        await redis.set(`shop-${shopId}:-`, JSON.stringify(seller));

        res.status(201).json({
            success: true,
            seller
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


interface IUpdateShop {
    name: string;
    email: string;
    phoneNumber: string;
    description: string;
    address: string;
    pinCode: number;
}

export const updateShopInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, description, address, phoneNumber, pinCode } = req.body as IUpdateShop;

        const shopId = req.seller?._id;

        const shop = await Shop.findById(shopId);

        if (!shop) {
            return next(new ErrorHandler("Shop not found", 400));
        }

        if (name) {
            shop.name = name;
        }
        if (email) {
            shop.email = email;
        }
        if (phoneNumber) {
            shop.phoneNumber = phoneNumber;
        }
        if (description) {
            shop.description = description;
        }
        if (address) {
            shop.address = address;
        }
        if (pinCode) {
            shop.pinCode = pinCode;
        }

        const updatedShop = await Shop.findByIdAndUpdate(shopId, shop, { new: true });

        await redis.set(`shop-${shopId}:-`, JSON.stringify(updatedShop));

        res.status(201).json({
            success: true,
            shop: updatedShop,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllShopsByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellers = await Shop.find().sort({
            createdAt: 1, updatedAt: 1,
        });
        res.status(201).json({
            success: true,
            sellers,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const updateShopByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const seller = await Shop.findByIdAndUpdate(req.params.shopId, req.body, { new: true });

        if (!seller) {
            return next(new ErrorHandler("Shop not found", 404));
        }

        await redis.set(`shop-${req.params.shopId}`, JSON.stringify(seller));

        res.status(201).json({
            success: true,
            seller,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteShopByAdmin = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return next(
                new ErrorHandler("Shop not found", 404)
            );
        }

        await Shop.findByIdAndDelete(req.params.id);

        await redis.del(`shop-${req.params.id}:-`);

        res.status(201).json({
            success: true,
            message: "Shop deleted successfully!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


export const updateShopPayentmethods = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bankName, bankCountry, bankSwiftCode, bankHolderName, bankAccountNumber, bankAddress } = req.body;
        console.log("withdrawMethod :", bankName, bankCountry, bankSwiftCode, bankHolderName, bankAccountNumber, bankAddress);

        const withdrawMethod = { bankName, bankCountry, bankSwiftCode, bankHolderName, bankAccountNumber, bankAddress }


        const seller = await Shop.findByIdAndUpdate(req.seller._id, {
            withdrawMethod,
        }, { new: true });

        console.log("shop: ", seller);


        if (!seller) {
            return next(new ErrorHandler("Shop not found", 404));
        }

        await redis.set(`shop-${req.seller?._id}:-`, JSON.stringify(seller));

        res.status(201).json({
            success: true,
            seller,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


export const deleteShopWithdrawMethods = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shop = await Shop.findById(req.seller._id);

        if (!shop) {
            return next(new ErrorHandler("Shop not found", 400));
        }
        else {
            shop.withdrawMethod = {};

            await shop.save();

            await redis.set(`shop-${req.seller?._id}:-`, JSON.stringify(shop));

            res.status(201).json({
                success: true,
                shop,
            });
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});
