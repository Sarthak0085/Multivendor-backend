"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.updateUserByAdmin = exports.getAllUsers = exports.getUserInfoById = exports.updatePassword = exports.deleteUserAddress = exports.updateUserAddress = exports.updateUserAvatar = exports.updateUserInfo = exports.resetPassword = exports.createResetToken = exports.forgotPassword = exports.getUser = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.register = void 0;
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const redis_1 = require("../utils/redis");
const user_service_1 = require("../services/user.service");
// register user
exports.register = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { fullName, email, password, avatar } = req.body;
        if (!fullName || fullName === "" || !email || email === "" || !password || password === "") {
            return next(new ErrorHandler_1.default("Please fill all the details", 401));
        }
        const userEmail = await user_model_1.default.findOne({ email });
        if (userEmail) {
            return next(new ErrorHandler_1.default("User already exists", 400));
        }
        const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
            folder: "avatars",
        });
        const user = {
            fullName: fullName,
            email: email,
            password: password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
        };
        const activationToken = (0, exports.createActivationToken)(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.fullName }, activationCode };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activationMail.ejs"), data);
        try {
            await (0, sendMail_1.default)({
                email: user.email,
                subject: "Activate your account",
                template: "activationMail.ejs",
                data
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account.`,
                activationToken: activationToken.token
            });
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 400));
        }
        ;
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// create activation token
const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        user, activationCode
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    });
    return { activationCode, token };
};
exports.createActivationToken = createActivationToken;
// activate user
exports.activateUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        if (!activation_token || activation_token === "" || !activation_code || activation_code === "") {
            return next(new ErrorHandler_1.default("Please fill all the details", 401));
        }
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default('Invalid Activation Code', 400));
        }
        const { fullName, email, password } = newUser.user;
        const existUser = await user_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("Email Already Exist", 400));
        }
        const user = await user_model_1.default.create({
            fullName,
            email,
            password,
        });
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// login user
exports.loginUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please provide your email and password", 400));
        }
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("User not found. Please register first.", 404));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//logout user
exports.logoutUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        const userId = req.user?._id || '';
        res.status(200).json({
            success: true,
            message: "Logout Successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update access token
exports.updateAccessToken = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        const decoded = jsonwebtoken_1.default.verify(refresh_token, process.env.REFRESH_TOKEN);
        if (!decoded) {
            return next(new ErrorHandler_1.default("Could not refresh token", 400));
        }
        const session = await redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
        }
        const user = JSON.parse(session);
        req.user = user;
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_TOKEN, { expiresIn: "5m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.REFRESH_TOKEN, { expiresIn: "3d" });
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(user._id, JSON.stringify(user), "EX", 604800); //expire after 7 days
        // res.status(200).json({
        //     message: "Successfully"
        // })
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
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
// get user
exports.getUser = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        (0, user_service_1.getUserById)(userId, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// // forgot password
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        return next(new ErrorHandler_1.default("User Not found with this Email. Please Register first", 401));
    }
    const resetToken = (0, exports.createResetToken)(user);
    user.save();
    const activationCode = resetToken.resetOtp;
    console.log("Reset: ", resetToken);
    const data = { user: { name: user.fullName }, activationCode };
    const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activationMail.ejs"), data);
    try {
        await (0, sendMail_1.default)({
            email: user.email,
            subject: "Reset Password",
            template: "resetMail.ejs",
            data
        });
        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to reset your password.`,
            resetToken: resetToken.resetToken,
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.resetOtp = undefined;
        user.save();
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const createResetToken = (user) => {
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = jsonwebtoken_1.default.sign({
        user, resetOtp
    }, process.env.RESET_SECRET, {
        expiresIn: "10m"
    });
    user.passwordResetToken = resetToken;
    user.resetOtp = resetOtp;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return { resetOtp, resetToken, user };
};
exports.createResetToken = createResetToken;
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { reset_token, newPassword, reset_otp } = req.body;
    if (!reset_token || reset_token === "") {
        return next(new ErrorHandler_1.default("Reset Token Expires", 404));
    }
    if (!reset_otp || reset_otp === "" || !newPassword || newPassword === "" || !reset_token || reset_token === "") {
        return next(new ErrorHandler_1.default("Please fill all the details", 401));
    }
    const payload = jsonwebtoken_1.default.verify(reset_token, process.env.RESET_SECRET);
    if (payload.resetOtp !== reset_otp) {
        return next(new ErrorHandler_1.default('Invalid OTP', 400));
    }
    const user = await user_model_1.default.findById(payload.user._id);
    if (!user) {
        return next(new ErrorHandler_1.default('User not found', 404));
    }
    if (user.passwordResetExpires === undefined) {
        return next(new ErrorHandler_1.default('Reset token has expired', 400));
    }
    // const expirationDate = new Date(user.passwordResetExpires);
    // if (user?.passwordResetExpires && Date.now() > ) {
    // }
    try {
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.resetOtp = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password Reset successful',
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.resetOtp = undefined;
        user.save();
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update user info
exports.updateUserInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, phoneNumber, fullName } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 400));
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
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, user, { new: true });
        res.status(201).json({
            success: true,
            user: updatedUser,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update user avatar
exports.updateUserAvatar = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (avatar === null) {
            return next(new ErrorHandler_1.default("Avatar not found", 400));
        }
        if (avatar && user) {
            // if user already have avatar
            if (user.avatar?.public_id) {
                // first delete the old image
                cloudinary_1.default.v2.uploader.destroy(user?.avatar?.public_id);
                // then add other avatar
                const myCloud = cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150
                });
                user.avatar = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                };
            }
            else {
                const myCloud = cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150
                });
                user.avatar = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                };
            }
        }
        await user?.save();
        await redis_1.redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update user address
exports.updateUserAddress = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        const sameTypeAddress = user.addresses?.find((address) => address.addressType === req.body.addressType);
        if (sameTypeAddress) {
            return next(new ErrorHandler_1.default(`${req.body.addressType} address already exists`, 401));
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete user address
exports.deleteUserAddress = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const addressId = req.params.id;
        await user_model_1.default.updateOne({
            _id: userId,
        }, { $pull: { addresses: { _id: addressId } } });
        const user = await user_model_1.default.findById(userId);
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update password
exports.updatePassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await user_model_1.default.findById(req.user?._id).select("+password");
        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler_1.default("Please enter old and new password", 400));
        }
        if (user?.password === undefined) {
            return next(new ErrorHandler_1.default("Invalid user", 400));
        }
        const isMatched = await user?.comparePassword(oldPassword);
        if (!isMatched) {
            return next(new ErrorHandler_1.default("Invalid old password", 400));
        }
        user.password = newPassword || user?.password;
        await user?.save();
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        res.status(201).json({
            success: true,
            message: "Password updated successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// get user info by id
exports.getUserInfoById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.params.id);
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get all users by admin
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const users = await user_model_1.default.find().sort({
            createdAt: 1, updatedAt: 1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update user role or block/ unblock the user
exports.updateUserByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const user = await user_model_1.default.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!user) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete user by admin
exports.deleteUserById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        const imageId = user.avatar?.public_id;
        if (imageId) {
            await cloudinary_1.default.v2.uploader.destroy(imageId);
            await user_model_1.default.findByIdAndDelete(req.params.id);
        }
        // await redis.del(id);
        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
