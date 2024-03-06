"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShopWithdrawMethods = exports.updateShopPayentmethods = exports.deleteShopByAdmin = exports.updateShopByAdmin = exports.getAllShopsByAdmin = exports.updateShopInfo = exports.updateShopAvatar = exports.resetShopPassword = exports.createResetToken = exports.forgotShopPassword = exports.getShopInfoById = exports.getShop = exports.updateSellerAccessToken = exports.logoutShop = exports.loginShop = exports.activateShop = exports.createActivationToken = exports.shopRegister = void 0;
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
const shop_model_1 = __importDefault(require("../models/shop.model"));
const shopToken_1 = require("../utils/shopToken");
// register shop
exports.shopRegister = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, address, description, phoneNumber, pinCode, password, avatar } = req.body;
        if (!name || name.trim() === "" || !email || email.trim() === "" ||
            !password || password.trim() === "" || !address || address.trim() === ""
            || !phoneNumber || phoneNumber.trim() === "" || !pinCode || !avatar || avatar === "") {
            return next(new ErrorHandler_1.default("Please fill all the details", 401));
        }
        const sellerEmail = await user_model_1.default.findOne({ email });
        if (sellerEmail) {
            return next(new ErrorHandler_1.default("Seller already exists", 400));
        }
        const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
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
        const activationToken = (0, exports.createActivationToken)(seller);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: seller.name }, activationCode };
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activationMail.ejs"), data);
        try {
            await (0, sendMail_1.default)({
                email: seller.email,
                subject: "Activate your account",
                template: "activationMail.ejs",
                data
            });
            res.status(201).json({
                success: true,
                message: `Thanks for registering ${seller.name}, Please check your email: ${seller.email} to activate your account.`,
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
const createActivationToken = (seller) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jsonwebtoken_1.default.sign({
        seller, activationCode
    }, process.env.SHOP_ACTIVATION_SECRET, {
        expiresIn: "5m"
    });
    return { activationCode, token };
};
exports.createActivationToken = createActivationToken;
exports.activateShop = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { activation_token, activation_code } = req.body;
        if (!activation_token || activation_token === "" || !activation_code || activation_code === "") {
            return next(new ErrorHandler_1.default("Please fill all the details", 401));
        }
        const newSeller = jsonwebtoken_1.default.verify(activation_token, process.env.SHOP_ACTIVATION_SECRET);
        if (newSeller.activationCode !== activation_code) {
            return next(new ErrorHandler_1.default('Invalid Activation Code', 400));
        }
        console.log(newSeller?.seller);
        const { name, email, password, description, address, phoneNumber, pinCode, avatar } = newSeller.seller;
        const existUser = await shop_model_1.default.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler_1.default("Email Already Exist", 400));
        }
        const shop = await shop_model_1.default.create({
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
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// login shop
exports.loginShop = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please provide your email and password", 400));
        }
        const seller = await shop_model_1.default.findOne({ email }).select("+password");
        if (!seller) {
            return next(new ErrorHandler_1.default("Shop not found.Please register first.", 404));
        }
        if (seller.isBlock) {
            return next(new ErrorHandler_1.default("This account has been blocked by admin.", 404));
        }
        const isPasswordMatched = await seller.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler_1.default("Invalid email or password", 400));
        }
        (0, shopToken_1.sendShopToken)(seller, 200, res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//logout shop
exports.logoutShop = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        res.cookie("seller_access_token", "", { maxAge: 1 });
        res.cookie("seller_refresh_token", "", { maxAge: 1 });
        const sellerId = req.seller?._id || '';
        res.status(200).json({
            success: true,
            message: "Logout Successfully"
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update access token
exports.updateSellerAccessToken = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const seller_refresh_token = req.cookies.seller_refresh_token;
        const decoded = jsonwebtoken_1.default.verify(seller_refresh_token, process.env.SELLER_REFRESH_TOKEN);
        console.log("decoded: ", decoded);
        if (!decoded) {
            return next(new ErrorHandler_1.default("Could not refresh token", 400));
        }
        const session = await redis_1.redis.get(`shop-${decoded.id}:-`);
        if (!session) {
            return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
        }
        const seller = JSON.parse(session);
        req.seller = seller;
        console.log(req.seller);
        const accessToken = jsonwebtoken_1.default.sign({ id: seller._id }, process.env.SELLER_ACCESS_TOKEN, { expiresIn: "5m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: seller._id }, process.env.SELLER_REFRESH_TOKEN, { expiresIn: "3d" });
        res.cookie("seller_access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_access_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(`shop-${seller._id}:-`, JSON.stringify(seller), "EX", 604800); //expire after 7 days
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// load shop
exports.getShop = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shopData = await redis_1.redis.get(`shop-${req?.seller?._id}:-`);
        if (shopData) {
            const seller = JSON.parse(shopData);
            res.status(200).json({
                success: true,
                seller,
            });
        }
        else {
            const seller = await shop_model_1.default.findById(req?.seller._id);
            if (!seller) {
                return next(new ErrorHandler_1.default("Shop doesn't exists", 400));
            }
            res.status(200).json({
                success: true,
                seller,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getShopInfoById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shopData = await redis_1.redis.get(`shop-${req?.params?.id}:-`);
        if (shopData) {
            const seller = JSON.parse(shopData);
            res.status(200).json({
                success: true,
                seller,
            });
        }
        else {
            const seller = await shop_model_1.default.findById(req?.params?.id);
            if (!seller) {
                return next(new ErrorHandler_1.default("Shop doesn't exists", 400));
            }
            res.status(200).json({
                success: true,
                seller,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// // forgot password
exports.forgotShopPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { email } = req.body;
    const seller = await shop_model_1.default.findOne({ email });
    if (!seller) {
        return next(new ErrorHandler_1.default("Seller Not found with this Email. Please Register first", 401));
    }
    const resetToken = (0, exports.createResetToken)(seller);
    seller.save();
    const activationCode = resetToken.resetOtp;
    console.log("Reset: ", resetToken);
    const data = { user: { name: seller.name }, activationCode };
    const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/activationMail.ejs"), data);
    try {
        await (0, sendMail_1.default)({
            email: seller.email,
            subject: "Reset Password",
            template: "resetMail.ejs",
            data
        });
        res.status(201).json({
            success: true,
            message: `Please check your email: ${seller.email} to reset your password.`,
            resetToken: resetToken.resetToken,
        });
    }
    catch (error) {
        seller.passwordResetToken = undefined;
        seller.resetOtp = undefined;
        seller.save();
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const createResetToken = (seller) => {
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = jsonwebtoken_1.default.sign({
        seller, resetOtp
    }, process.env.SHOP_RESET_SECRET, {
        expiresIn: "10m"
    });
    seller.passwordResetToken = resetToken;
    seller.resetOtp = resetOtp;
    seller.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return { resetOtp, resetToken, seller };
};
exports.createResetToken = createResetToken;
exports.resetShopPassword = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    const { reset_token, newPassword, reset_otp } = req.body;
    if (!reset_token || reset_token === "") {
        return next(new ErrorHandler_1.default("Reset Token Expires", 404));
    }
    if (!reset_otp || reset_otp === "" || !newPassword || newPassword === "" || !reset_token || reset_token === "") {
        return next(new ErrorHandler_1.default("Please fill all the details", 401));
    }
    const payload = jsonwebtoken_1.default.verify(reset_token, process.env.SHOP_RESET_SECRET);
    if (payload.resetOtp !== reset_otp) {
        return next(new ErrorHandler_1.default('Invalid OTP', 400));
    }
    const seller = await shop_model_1.default.findById(payload.seller._id);
    if (!seller) {
        return next(new ErrorHandler_1.default('Seller not found', 404));
    }
    if (seller.passwordResetExpires === undefined) {
        return next(new ErrorHandler_1.default('Reset token has expired', 400));
    }
    try {
        seller.password = newPassword;
        seller.passwordResetToken = undefined;
        seller.passwordResetExpires = undefined;
        seller.resetOtp = undefined;
        await seller.save();
        await redis_1.redis.set(`shop-${seller?._id}:-`, JSON.stringify(seller));
        res.status(200).json({
            success: true,
            message: 'Password Reset successful',
        });
    }
    catch (error) {
        seller.passwordResetToken = undefined;
        seller.passwordResetExpires = undefined;
        seller.resetOtp = undefined;
        seller.save();
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateShopAvatar = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const shopId = req.seller?._id;
        const seller = await shop_model_1.default.findById(shopId);
        if (avatar === null) {
            return next(new ErrorHandler_1.default("Avatar not found", 400));
        }
        console.log(seller?.avatar.public_id);
        if (avatar && seller) {
            if (seller?.avatar.public_id) {
                await cloudinary_1.default.v2.uploader.destroy(seller?.avatar.public_id);
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "shop_avatars",
                    width: 150
                });
                seller.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
            else {
                const myCloud = await cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "shop_avatars",
                    width: 150
                });
                seller.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
            }
        }
        console.log(seller?.avatar.public_id);
        if (!seller) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        await seller.save();
        await redis_1.redis.set(`shop-${shopId}:-`, JSON.stringify(seller));
        res.status(201).json({
            success: true,
            seller
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateShopInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, description, address, phoneNumber, pinCode } = req.body;
        const shopId = req.seller?._id;
        const shop = await shop_model_1.default.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 400));
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
        const updatedShop = await shop_model_1.default.findByIdAndUpdate(shopId, shop, { new: true });
        await redis_1.redis.set(`shop-${shopId}:-`, JSON.stringify(updatedShop));
        res.status(201).json({
            success: true,
            shop: updatedShop,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllShopsByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const sellers = await shop_model_1.default.find().sort({
            createdAt: 1, updatedAt: 1,
        });
        res.status(201).json({
            success: true,
            sellers,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateShopByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const seller = await shop_model_1.default.findByIdAndUpdate(req.params.shopId, req.body, { new: true });
        if (!seller) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        await redis_1.redis.set(`shop-${req.params.shopId}`, JSON.stringify(seller));
        res.status(201).json({
            success: true,
            seller,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteShopByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shop = await shop_model_1.default.findById(req.params.id);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        await shop_model_1.default.findByIdAndDelete(req.params.id);
        await redis_1.redis.del(`shop-${req.params.id}:-`);
        res.status(201).json({
            success: true,
            message: "Shop deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateShopPayentmethods = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { bankName, bankCountry, bankSwiftCode, bankHolderName, bankAccountNumber, bankAddress } = req.body;
        console.log("withdrawMethod :", bankName, bankCountry, bankSwiftCode, bankHolderName, bankAccountNumber, bankAddress);
        const withdrawMethod = { bankName, bankCountry, bankSwiftCode, bankHolderName, bankAccountNumber, bankAddress };
        const seller = await shop_model_1.default.findByIdAndUpdate(req.seller._id, {
            withdrawMethod,
        }, { new: true });
        console.log("shop: ", seller);
        if (!seller) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        await redis_1.redis.set(`shop-${req.seller?._id}:-`, JSON.stringify(seller));
        res.status(201).json({
            success: true,
            seller,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteShopWithdrawMethods = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shop = await shop_model_1.default.findById(req.seller._id);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 400));
        }
        else {
            shop.withdrawMethod = {};
            await shop.save();
            await redis_1.redis.set(`shop-${req.seller?._id}:-`, JSON.stringify(shop));
            res.status(201).json({
                success: true,
                shop,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
