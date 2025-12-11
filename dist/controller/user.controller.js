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
        // Lấy Token 
        const payload = {
            id: user._id,
            user: user.username,
            email: user.email
        };
        const accesToken = jsonwebtoken_1.default.sign(payload, jwt_1.SECRET_KEY, { expiresIn: "1h" });
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
            accesToken: accesToken,
            authorize: true
        });
    }
    catch (err) {
        console.error("🔥 Login error:", err);
        res.status(500).json({ message: "Lỗi server", err });
    }
};
exports.login = login;
// Tạo user
const createUser = async (req, res) => {
    try {
        const { username, password, room, email, } = req.body;
        // Kiểm tra username có tồn tại chưa
        const existingUser = await user_models_1.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username đã tồn tại" });
        }
        // Tạo user mới — KHÔNG cần tạo id thủ công -> Object_id
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
//Lấy toàn bộ user
const getUser = async (req, res) => {
    try {
        const limitDefault = 10;
        const limit = parseInt(req.query.limit) || limitDefault;
        const offset = parseInt(req.query.offset) || 0;
        const page = parseInt(req.query.page) || Math.floor(offset / limit) + 1;
        const skip = offset || (page - 1) * limit;
        const searchText = req.query.search;
        if (req.query.limit && isNaN(Number(req.query.limit))) {
            return res.status(400).json({ message: 'limit must be number' });
        }
        if (req.query.page && isNaN(Number(req.query.page))) {
            return res.status(400).json({ message: 'page must be number' });
        }
        if (req.query.offset && isNaN(Number(req.query.offset))) {
            return res.status(400).json({ message: 'offset must be number' });
        }
        if (req.query.searchText && typeof req.query.searchText !== "string") {
            return res.status(400).json({ message: 'searchtext' });
        }
        const matchStage = searchText ? {
            $match: {
                $or: [
                    { name: { $regex: searchText, $options: 'i' } },
                    { email: { $regex: searchText, $options: 'i' } },
                ]
            }
        }
            : { $match: {} };
        // >>> Toán tử 3 ngôi điều kiện nếu có matchStage ? a : b
        const countPromise = user_models_1.User.aggregate([
            matchStage,
            { $count: "total" }
        ]);
        const findPromise = user_models_1.User.aggregate([
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { password: 0 } } //Tùy chọn ẩn mật khẩu
        ]);
        const [countResult, users] = await Promise.all([countPromise, findPromise]);
        const totalUsers = countResult.length > 0 ? countResult[0].total : 0; // Toán tử 3 ngôi 
        // Tính toán thông tin phân trang (metadata)
        const totalPages = Math.ceil(totalUsers / limit);
        res.json({
            users,
            pagination: {
                totalUsers,
                limit,
                offset: offset,
                currentPage: page,
                totalPages,
            }
        });
    }
    catch (err) {
        console.error("❌ getAllUsers error", err);
        res.status(500).json({ message: " Error fetching users ", err });
    }
};
exports.getUser = getUser;
// Update user 
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, phone, email, address, room } = req.body;
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