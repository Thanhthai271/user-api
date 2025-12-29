"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.updateUser = exports.deleteUser = exports.getUser = exports.getUserById = exports.createUser = void 0;
const user_models_1 = require("../users/user.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const mongoose_1 = require("mongoose");
const user_refreshToken_1 = require("../users/user.refreshToken");
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user_models_1.User.findOne({ username, password });
        if (!user) {
            return res.status(404).json({ message: "Sai username hoặc password" });
        }
        const payload = {
            id: user._id,
            user: user.username,
            email: user.email
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, jwt_1.SECRET_KEY, { expiresIn: "1h" });
        const timeDeathToken = 7 * 24 * 60 * 60 * 1000;
        const refreshToken = jsonwebtoken_1.default.sign(payload, jwt_1.SECRET_KEY_REFRESH, { expiresIn: "7d" });
        await user_refreshToken_1.RefreshToken.create({
            refreshToken: refreshToken,
            user: user._id,
            expiresAt: new Date(Date.now() + timeDeathToken)
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken: accessToken,
            authorize: true
        });
    }
    catch (err) {
        console.error("🔥 Login error:", err);
        res.status(500).json({ message: "Lỗi server", err });
    }
};
exports.login = login;
const createUser = async (req, res) => {
    try {
        const { username, password, room, email, } = req.body;
        const existingUser = await user_models_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username đã tồn tại" });
        }
        const newUser = new user_models_1.User({
            username,
            password,
            email,
            room
        });
        await newUser.save();
        res.status(200).json({
            message: "Tạo user thành công",
            user: newUser,
        });
    }
    catch (err) {
        console.error("❌ register error", err);
        res.status(500).json({ message: "Server error", err });
    }
};
exports.createUser = createUser;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Bad request" });
        }
        const getUserById = await user_models_1.User.findOne(new mongoose_1.Types.ObjectId(id));
        if (!getUserById) {
            return res.status(400).json({ message: 'User not found' });
        }
        return res.status(200).json(getUserById);
    }
    catch (err) {
        console.log(">>> Error : ", err);
    }
};
exports.getUserById = getUserById;
const getUser = async (req, res) => {
    try {
        const limitDefault = 10;
        const limitRaw = Number(req.query.limit);
        const offsetRaw = Number(req.query.offset);
        const pageRaw = Number(req.query.page);
        const skipRaw = Number(req.query.skip);
        const searchText = req.query.search;
        if (req.query.limit !== undefined && (isNaN(limitRaw)) || limitRaw < 0) {
            return res.status(400).json({ message: 'limit must be number' });
        }
        if (req.query.offset !== undefined && (isNaN(offsetRaw) || offsetRaw < 0)) {
            return res.status(400).json({ message: 'offset must be non-negative number' });
        }
        if (req.query.page !== undefined && (isNaN(pageRaw) || pageRaw < 1)) {
            return res.status(400).json({ message: 'page must be positive number' });
        }
        if (req.query.skip !== undefined && (isNaN(skipRaw) || skipRaw < 0)) {
            return res.status(400).json({ message: 'skip must be non-negative number' });
        }
        const limit = !isNaN(limitRaw) ? limitRaw : limitDefault;
        const offset = !isNaN(offsetRaw) ? offsetRaw : 0;
        const page = !isNaN(pageRaw)
            ? pageRaw
            : Math.floor(offset / limit) + 1;
        const skip = !isNaN(skipRaw)
            ? skipRaw
            : (page - 1) * limit;
        const matchStage = searchText
            ? {
                $match: {
                    $or: [
                        { name: { $regex: searchText, $options: 'i' } },
                        { email: { $regex: searchText, $options: 'i' } }
                    ]
                }
            }
            : { $match: {} };
        const countPromise = user_models_1.User.aggregate([
            matchStage,
            { $count: "total" }
        ]);
        const findPromise = user_models_1.User.aggregate([
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { password: 0 } }
        ]);
        const [countResult, users] = await Promise.all([countPromise, findPromise]);
        const totalUsers = countResult.length > 0 ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            return res.status(400).json({ message: `Hiện tại chỉ có ${totalPages} trang` });
        }
        if (skip >= totalUsers && totalUsers > 0) {
            return res.status(400).json({ message: `Hiện tại chỉ có ${totalUsers} người` });
        }
        if (limit >= totalUsers && totalUsers > 0) {
            return res.status(400).json({ message: `Hiện tại chỉ có ${totalUsers} người` });
        }
        return res.status(200).json({
            users,
            pagination: {
                totalUsers,
                limit,
                offset,
                currentPage: page,
                totalPages
            }
        });
    }
    catch (err) {
        console.error("❌ getAllUsers error", err);
        return res.status(500).json({ message: "Error fetching users", err });
    }
};
exports.getUser = getUser;
// Update user 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.params;
        const { password, phone, address, room } = req.body;
        if (id) {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Bad request, try again" });
            }
            const updateUserbyid = await user_models_1.User.findByIdAndUpdate({ _id: new mongoose_1.Types.ObjectId(id) }, { username, password, phone, email, address, room }, { new: true, upsert: false });
            if (!updateUserbyid) {
                return res.status(404).json({ message: "User not found, try by username or email" });
            }
            return res.json(updateUserbyid);
        }
        if (username || email) {
            const updateUser = await user_models_1.User.findOneAndUpdate({ $or: [{ username }, { email }] }, { username, email, password, phone, room, address }, { new: true, upsert: false });
            if (!updateUser) {
                return res.status(404).json({ message: "User not found, try by id" });
            }
            return res.json(updateUser);
        }
        return res.json({ message: "username, email or id not found " });
    }
    catch (err) {
        console.error("❌ update error:", err);
        res.status(500).json({ message: "Server error", err });
    }
};
exports.updateUser = updateUser;
// Delete user 
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id || " ";
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Bad request" });
        }
        const deleteUser = await user_models_1.User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Deleted user" });
    }
    catch (err) {
        console.log('error : ', err);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map