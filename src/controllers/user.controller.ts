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

// register user
interface IRegistrationbody {
    fullName: string,
    email: string,
    password: string,
    avatar?: string,
}

// register user
export const register = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, email, password } = req.body as IRegistrationbody;

        if (!fullName || fullName === "" || !email || email === "" || !password || password === "") {
            return next(new ErrorHandler("Please fill all the details", 401));
        }

        const userEmail = await User.findOne({ email });

        if (userEmail) {
            return next(new ErrorHandler("User already exists", 400));
        }

        // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //     folder: "avatars",
        // });

        const user = {
            fullName: fullName,
            email: email,
            password: password,
            // avatar: {
            //     public_id: await myCloud.public_id,
            //     url: await myCloud.secure_url,
            // },
        };

        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;

        const data = { user: { name: user.fullName }, activationCode };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activationMail.ejs"), data);

        try {
            await sendEmail({
                email: user.email,
                subject: "Activate your account",
                template: "activationMail.ejs",
                data
            });


            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account.`,
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
export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign({
        user, activationCode
    }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: "5m"
    })

    return { activationCode, token };
}

interface IActivationRequest {
    activation_token: string,
    activation_code: string,
}

export const activateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_token, activation_code } = req.body as IActivationRequest;

        if (!activation_token || activation_token === "" || !activation_code || activation_code === "") {
            return next(new ErrorHandler("Please fill all the details", 401));
        }

        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string,
        ) as { user: IUser; activationCode: string };

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler('Invalid Activation Code', 400));
        }
        const { fullName, email, password } = newUser.user;
        const existUser = await User.findOne({ email });

        if (existUser) {
            return next(new ErrorHandler("Email Already Exist", 400));
        }

        const user = await User.create({
            fullName,
            email,
            password,
        });

        res.status(200).json({
            success: true,
            user,
        })

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

interface ILoginRequest {
    email: string,
    password: string,
}

// login user
export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide your email and password", 400));
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found. Please register first.", 404));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }

        sendToken(user, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

//logout user
export const logoutUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id || '';

        res.status(200).json({
            success: true,
            message: "Logout Successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// update access token
export const updateAccessToken = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler("Could not refresh token", 400));
        }

        const session = await redis.get(decoded.id as string);

        if (!session) {
            return next(new ErrorHandler("Please login to access this resource!", 400));
        }

        const user = JSON.parse(session);
        req.user = user;

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, { expiresIn: "5m" });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, { expiresIn: "3d" });

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);

        await redis.set(user._id, JSON.stringify(user), "EX", 604800); //expire after 7 days

        // res.status(200).json({
        //     message: "Successfully"
        // })
        next();

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// // activate user
// router.post(
//     "/activation",
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             const { activation_token } = req.body;

//             const newUser = jwt.verify(
//                 activation_token,
//                 process.env.ACTIVATION_SECRET
//             );

//             if (!newUser) {
//                 return next(new ErrorHandler("Invalid token", 400));
//             }
//             const { name, email, password, avatar } = newUser;

//             let user = await User.findOne({ email });

//             if (user) {
//                 return next(new ErrorHandler("User already exists", 400));
//             }
//             user = await User.create({
//                 name,
//                 email,
//                 avatar,
//                 password,
//             });

//             sendToken(user, 201, res);
//         } catch (error) {
//             return next(new ErrorHandler(error.message, 500));
//         }
//     })
// );

// // login user
// router.post(
//     "/login-user",
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             const { email, password } = req.body;

//             if (!email || !password) {
//                 return next(new ErrorHandler("Please provide the all fields!", 400));
//             }

//             const user = await User.findOne({ email }).select("+password");

//             if (!user) {
//                 return next(new ErrorHandler("User doesn't exists!", 400));
//             }

//             const isPasswordValid = await user.comparePassword(password);

//             if (!isPasswordValid) {
//                 return next(
//                     new ErrorHandler("Please provide the correct information", 400)
//                 );
//             }

//             sendToken(user, 201, res);
//         } catch (error) {
//             return next(new ErrorHandler(error.message, 500));
//         }
//     })
// );

// // load user
// router.get(
//     "/getuser",
//     isAuthenticated,
// get user
export const getUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        getUserById(userId, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// // forgot password
// export const forgotPassword = CatchAsyncError(async (req, res, next) => {
//     const { email } = req.body

//     const user = await userModel.findOne({ email })

//     if (!user) {
//         return next(new ErrorHandler("User Not found with this Email. Please Register first", 401));
//     }

//     const resetToken = user.createPasswordResetToken()
//     user.save()

//     const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

//     const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: "Your Password reset token. (valid for 10mins)",
//             message,
//         })

//         res.status(200).json({
//             message: "Token Sent to email!",
//         })
//     } catch (error) {
//         user.passwordResetToken = undefined
//         user.passwordResetExpires = undefined
//         user.save()
//         console.log(error)

//         return next(new ErrorHandler(error.message, 500));
//     }
// })

// //reset password
// export const resetPassword = CatchAsyncError(async (req, res, next) => {
//     try {
//         const hashedToken = crypto
//             .createHash("sha256")
//             .update(req.params.resetToken)
//             .digest("hex")

//         const user = await userModel.findOne({
//             passwordResetToken: hashedToken,
//             passwordResetExpires: { $gt: Date.now() },
//         })

//         if (user !== null) {
//             user.password = req.body.password
//             user.passwordResetToken = undefined
//             user.passwordResetExpires = undefined
//             user.save()

//             createToken(user, res, "10m")

//             res.status(200).json({
//                 success: true,
//                 user
//             })
//         }
//         else {
//             return next(new ErrorHandler("Token Failed", 400));
//         }
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });

// // log out user
// router.get(
//     "/logout",
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             res.cookie("token", null, {
//                 expires: new Date(Date.now()),
//                 httpOnly: true,
//                 sameSite: "none",
//                 secure: true,
//             });
//             res.status(201).json({
//                 success: true,
//                 message: "Log out successful!",
//             });
//         } catch (error) {
//             return next(new ErrorHandler(error.message, 500));
//         }
//     })
// );

// // update user info
// router.put(
//     "/update-user-info",
//     isAuthenticated,

interface IUpdateUserInfo {
    email: string;
    phoneNumber: string;
    fullName: string;
}

export const updateUserInfo = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phoneNumber, fullName } = req.body as IUpdateUserInfo;

        const userId = req.user?._id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }


        if (fullName) {
            user.fullName = fullName;
        }
        if (email) {
            user.email = email;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, user, { new: true });


        // const isPasswordValid = await user.comparePassword(password);

        // if (!isPasswordValid) {
        //     return next(
        //         new ErrorHandler("Please provide the correct information", 400)
        //     );
        // }

        // user.fullName = fullName || user.fullName;
        // user.email = email || user.email;
        // user.phoneNumber = phoneNumber || user.phoneNumber;

        // await user.save();

        res.status(201).json({
            success: true,
            user: updatedUser,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// // update user avatar
// router.put(
//     "/update-avatar",
//     isAuthenticated,

interface IupdateAvatar {
    avatar: string;
}

export const updateUserAvatar = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { avatar } = req.body as IupdateAvatar;
        const userId = req.user?._id;

        const user = await User.findById(userId);

        if (avatar === null) {
            return next(new ErrorHandler("Avatar not found", 400));
        }

        if (avatar && user) {
            // if user already have avatar
            if (user.avatar?.public_id) {
                // first delete the old image
                cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                // then add other avatar
                const myCloud = cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150
                });
                user.avatar = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                }
            } else {
                const myCloud = cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150
                });
                user.avatar = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                }
            }
        }

        await user?.save();

        await redis.set(userId, JSON.stringify(user));

        res.status(201).json({
            success: true,
            user
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// // update user addresses
// router.put(
//     "/update-user-addresses",
//     isAuthenticated,
export const updateUserAddress = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const sameTypeAddress = user.addresses?.find(
            (address) => address.addressType === req.body.addressType
        );

        if (sameTypeAddress) {
            return next(
                new ErrorHandler(`${req.body.addressType} address already exists`, 401)
            );
        }

        user.addresses?.push(req.body);


        // const existsAddress = user.addresses?.find(
        //     (address) => address._id === req.body._id
        // );

        // if (existsAddress) {
        //     Object.assign(existsAddress, req.body);
        // } else {
        //     // add the new address to the array
        //     user.addresses?.push(req.body);
        // }

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// // delete user address
// router.delete(
//     "/delete-user-address/:id",
//     isAuthenticated,
export const deleteUserAddress = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        const addressId = req.params.id;

        await User.updateOne(
            {
                _id: userId,
            },
            { $pull: { addresses: { _id: addressId } } }
        );

        const user = await User.findById(userId);

        res.status(200).json({ success: true, user });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

interface IUpdatePassword {
    oldPassword: string,
    newPassword: string,
}

// // update user password
// router.put(
//     "/update-user-password",
//     isAuthenticated,
export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePassword;
        const user = await User.findById(req.user?._id).select("+password");

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }

        if (user?.password === undefined) {
            return next(new ErrorHandler("Invalid user", 400));
        }

        const isMatched = await user?.comparePassword(oldPassword);

        if (!isMatched) {
            return next(new ErrorHandler("Invalid old password", 400));
        }

        user.password = newPassword || user?.password;

        await user?.save();

        await redis.set(req.user?._id, JSON.stringify(user));

        res.status(201).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// // find user infoormation with the userId
// router.get(
//     "/user-info/:id",
export const getUserInfoById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// // all users --- for admin
// router.get(
//     "/admin-all-users",
//     isAuthenticated,
//     isAdmin("Admin"),
export const getAllUsers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// // delete users --- admin
// router.delete(
//     "/delete-user/:id",
//     isAuthenticated,
//     isAdmin("Admin"),
export const deleteUserById = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler("User not found", 404)
            );
        }

        const imageId = user.avatar?.public_id;

        if (imageId) {
            await cloudinary.v2.uploader.destroy(imageId);
            await User.findByIdAndDelete(req.params.id);
        }

        // await redis.del(id);

        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

