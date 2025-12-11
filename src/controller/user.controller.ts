import type { Request, Response } from "express";
import { User } from "../users/user.models"
import jwt from "jsonwebtoken"
import { SECRET_KEY, SECRET_KEY_REFRESH } from "../utils/jwt";
import { Types } from "mongoose";
import { RefreshToken } from "../users/user.refreshToken";
import { id } from "zod/v4/locales";

const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(404).json({ message: "Sai username hoặc password" })
        }

        // Lấy Token 
        const payload = {
            id: user._id,
            user: user.username,
            email: user.email
        }

        const accesToken = jwt.sign(
            payload,
            SECRET_KEY as string,
            { expiresIn: "1h" }
        )

        const timeDeathToken = 7 * 24 * 60 * 60 * 1000

        const refreshToken = jwt.sign(
            payload,
            SECRET_KEY_REFRESH as string,
            { expiresIn: "7d" }
        )

        await RefreshToken.create({
            refreshToken: refreshToken,
            user: user._id,
            expiresAt: new Date(Date.now() + timeDeathToken)
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "Đăng nhập thành công",
            accesToken: accesToken,
            authorize: true
        });

    } catch (err) {
        console.error("🔥 Login error:", err);
        res.status(500).json({ message: "Lỗi server", err });
    }
};

// Tạo user
const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, room, email, } = req.body;

        // Kiểm tra username có tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username đã tồn tại" });
        }

        // Tạo user mới — KHÔNG cần tạo id thủ công -> Object_id
        const newUser = new User({
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

    } catch (err) {
        console.error("❌ register error", err);
        res.status(500).json({ message: "Server error", err });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id as string)) {
            return res.status(404).json({ message: "Bad request" })
        }

        const getUserById = await User.findOne(new Types.ObjectId(id as string));

        if (!getUserById) {
            return res.status(400).json({ message: 'User not found' })
        }

        return res.status(200).json(getUserById)
    } catch (err) {
        console.log(">>> Error : ", err)
    }
}

//Lấy toàn bộ user
const getUser = async (req: Request, res: Response) => {
    try {
        const limitDefault = 10;

        const limit = parseInt(req.query.limit as string) || limitDefault;
        const offset = parseInt(req.query.offset as string) || 0;
        const page = parseInt(req.query.page as string) || Math.floor(offset / limit) + 1;
        const skip = offset || (page - 1) * limit;
        const searchText = req.query.search as string

        if (req.query.limit && isNaN(Number(req.query.limit))) {
            return res.status(400).json({ message: 'limit must be number' })
        }

        if (req.query.page && isNaN(Number(req.query.page))) {
            return res.status(400).json({ message: 'page must be number' })
        }

        if (req.query.offset && isNaN(Number(req.query.offset))) {
            return res.status(400).json({ message: 'offset must be number' })
        }

        if (req.query.searchText && typeof req.query.searchText !== "string") {
            return res.status(400).json({ message: 'searchtext' })
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

        const countPromise = User.aggregate([
            matchStage,
            { $count: "total" }
        ])

        const findPromise = User.aggregate([
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { password: 0 } }//Tùy chọn ẩn mật khẩu

        ])

        const [countResult, users] = await Promise.all([countPromise, findPromise])

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
        })
    } catch (err) {
        console.error("❌ getAllUsers error", err)
        res.status(500).json({ message: " Error fetching users ", err });
    }
};


// Update user 
const updateUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { username, password, phone, email, address, room } = req.body;

        if (id) {
            if (!Types.ObjectId.isValid(id as string)) {
                res.status(400).json({ message: "Bad request, try again" })
            }
            const updateUserbyid = await User.findByIdAndUpdate(
                { _id: new Types.ObjectId(id) },
                { username, password, phone, email, address, room },
                { new: true, upsert: false }
            );

            if (!updateUserbyid) {
                return res.status(404).json({ message: "User not found, try by username or email" });
            }
            return res.json(updateUserbyid);
        }

        if (username || email) {
            const updateUser = await User.findOneAndUpdate(
                { $or: [{ username }, { email }] },
                { username, email, password, phone, room, address },
                { new: true, upsert: false }
            )

            if (!updateUser) {
                return res.status(404).json({ message: "User not found, try by id" })
            }
            return res.json(updateUser)
        }

        return res.json({ message: "username, email or id not found " })

    } catch (err) {
        console.error("❌ update error:", err);
        res.status(500).json({ message: "Server error", err });
    }
};


// Delete user 
const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id || " ";
        if (!Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Bad request" })
        }
        const deleteUser = await User.findByIdAndDelete(id)
        if (!deleteUser) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ message: "Deleted user" })

    } catch (err) {
        console.log('error : ', err)
    }
}




export { createUser,getUserById, getUser, deleteUser, updateUser, login };

