"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserById = exports.getAllUsers = exports.getUserInfoById = exports.updatePassword = exports.deleteUserAddress = exports.updateUserAddress = exports.updateUserAvatar = exports.updateUserInfo = exports.deleteShopWithdrawMethods = exports.updateShopPayentmethods = exports.deleteShopByAdmin = exports.getAllShopsByAdmin = exports.updateShopInfo = exports.updateShopAvatar = exports.getShopInfoById = exports.getShop = exports.updateSellerAccessToken = exports.logoutShop = exports.loginShop = exports.activateShop = exports.createActivationToken = exports.shopRegister = void 0;
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
        const { name, email, address, phoneNumber, pinCode, password } = req.body;
        if (!name || name.trim() === "" || !email || email.trim() === "" ||
            !password || password.trim() === "" || !address || address.trim() === ""
            || !phoneNumber || phoneNumber.trim() === "" || !pinCode) {
            return next(new ErrorHandler_1.default("Please fill all the details", 401));
        }
        const sellerEmail = await user_model_1.default.findOne({ email });
        if (sellerEmail) {
            return next(new ErrorHandler_1.default("Seller already exists", 400));
        }
        // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        //     folder: "avatars",
        // });
        const seller = {
            name: name,
            email: email,
            password: password,
            address: address,
            phoneNumber: phoneNumber,
            pinCode: pinCode,
            // avatar: {
            //     public_id: await myCloud.public_id,
            //     url: await myCloud.secure_url,
            // },
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
        const { name, email, password, address, phoneNumber, pinCode } = newSeller.seller;
        // console.log("name:", name, "->email:", email);
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
            pinCode
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
//logout user
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
        if (!decoded) {
            return next(new ErrorHandler_1.default("Could not refresh token", 400));
        }
        const session = await redis_1.redis.get(decoded.id);
        if (!session) {
            return next(new ErrorHandler_1.default("Please login to access this resource!", 400));
        }
        const seller = JSON.parse(session);
        req.seller = seller;
        const accessToken = jsonwebtoken_1.default.sign({ id: seller._id }, process.env.SELLER_ACCESS_TOKEN, { expiresIn: "5m" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: seller._id }, process.env.SELLER_REFRESH_TOKEN, { expiresIn: "3d" });
        res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
        res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
        await redis_1.redis.set(seller._id, JSON.stringify(seller), "EX", 604800); //expire after 7 days
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
// load shop
exports.getShop = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const seller = await shop_model_1.default.findById(req.seller._id);
        if (!seller) {
            return next(new ErrorHandler_1.default("Shop doesn't exists", 400));
        }
        res.status(200).json({
            success: true,
            seller,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get shop info
// router.get(
//     "/get-shop-info/:id",
exports.getShopInfoById = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shop = await shop_model_1.default.findById(req.params.id);
        res.status(201).json({
            success: true,
            shop,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update shop profile picture
// router.put(
//     "/update-shop-avatar",
//     isSeller,
exports.updateShopAvatar = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { avatar } = req.body;
        const shopId = req.seller?._id;
        const seller = await shop_model_1.default.findById(shopId);
        if (avatar === null) {
            return next(new ErrorHandler_1.default("Avatar not found", 400));
        }
        if (avatar && seller) {
            // if user already have avatar
            if (seller.avatar?.public_id) {
                // first delete the old image
                cloudinary_1.default.v2.uploader.destroy(seller?.avatar?.public_id);
                // then add other avatar
                const myCloud = cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "shop_avatars",
                    width: 150
                });
                seller.avatar = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                };
            }
            else {
                const myCloud = cloudinary_1.default.v2.uploader.upload(avatar, {
                    folder: "shop_avatars",
                    width: 150
                });
                seller.avatar = {
                    public_id: (await myCloud).public_id,
                    url: (await myCloud).secure_url
                };
            }
        }
        await seller?.save();
        await redis_1.redis.set(shopId, JSON.stringify(seller));
        res.status(201).json({
            success: true,
            seller
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// update shop info
// router.put(
//     "/update-seller-info",
//     isSeller,
exports.updateShopInfo = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { name, email, description, address, phoneNumber, pinCode } = req.body;
        const shopId = req.seller?._id;
        const shop = await shop_model_1.default.findOne(shopId);
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
        res.status(201).json({
            success: true,
            shop: updatedShop,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// all sellers --- for admin
// router.get(
//     "/admin-all-sellers",
//     isAuthenticated,
//     isAdmin("Admin"),
exports.getAllShopsByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const sellers = await shop_model_1.default.find().sort({
            createdAt: -1,
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
// delete seller ---admin
// router.delete(
//     "/delete-seller/:id",
//     isAuthenticated,
//     isAdmin("Admin"),
exports.deleteShopByAdmin = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shop = await shop_model_1.default.findById(req.params.id);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 404));
        }
        await shop_model_1.default.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: "Shop deleted successfully!",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update seller withdraw methods --- sellers
// router.put(
//     "/update-payment-methods",
//     isSeller,
exports.updateShopPayentmethods = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const { withdrawMethod } = req.body;
        const seller = await shop_model_1.default.findByIdAndUpdate(req.seller._id, {
            withdrawMethod,
        });
        res.status(201).json({
            success: true,
            seller,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// delete seller withdraw merthods --- only seller
// router.delete(
//     "/delete-withdraw-method/",
//     isSeller,
exports.deleteShopWithdrawMethods = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const shop = await shop_model_1.default.findById(req.seller._id);
        if (!shop) {
            return next(new ErrorHandler_1.default("Shop not found", 400));
        }
        else {
            shop.withdrawMethod = undefined;
            await shop.save();
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
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
// // update user addresses
// router.put(
//     "/update-user-addresses",
//     isAuthenticated,
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
// // delete user address
// router.delete(
//     "/delete-user-address/:id",
//     isAuthenticated,
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
// // update user password
// router.put(
//     "/update-user-password",
//     isAuthenticated,
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
// // find user infoormation with the userId
// router.get(
//     "/user-info/:id",
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
// // all users --- for admin
// router.get(
//     "/admin-all-users",
//     isAuthenticated,
//     isAdmin("Admin"),
exports.getAllUsers = (0, catchAsyncError_1.catchAsyncError)(async (req, res, next) => {
    try {
        const users = await user_model_1.default.find().sort({
            createdAt: -1,
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
// // delete users --- admin
// router.delete(
//     "/delete-user/:id",
//     isAuthenticated,
//     isAdmin("Admin"),
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
