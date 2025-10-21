import type { Request, Response } from "express";
import User from "../users/user.models"
import { error } from "console";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../utils/jwt";
import { Types } from "mongoose";



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
            { expiresIn: "1d" }
        )

        res.status(200).json({
            message: "Đăng nhập thành công",
            token: accesToken,
            authorize: true
        });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server", err });
    }
};


// Tạo user
const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra username có tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username đã tồn tại" });
        }

        // Tạo user mới — KHÔNG cần tạo id thủ công -> Object_id
        const newUser = new User({
            username,
            password
        });

        await newUser.save();
        res.status(201).json({
            message: "Tạo user thành công",
            user: newUser,
        });

    } catch (error) {
        console.error("Lỗi khi tạo user:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Tìm user 
const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            const { username, email } = req.body;
            if (!username && !email) {
                res.json({ message: "User not found" })
            } else {
                const user1 = await User.findOne({ $or: [{ username }, { email }] })
                res.json(user1);
            }

        } else {
            res.json(user);
        }

    } catch (err) {
        res.status(500).json({ message: "Error fetching user", err })
    }
};


//Lấy toàn bộ user
const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: " Error fetching users ", error });
    }
};


// Update user bằng id
const updateUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { username, password, phone, email, address } = req.body;

        if (!Types.ObjectId.isValid(id as string)) {
            res.status(400).json({ message: "Bad request" });
        } else {
            const updateUser = await User.findByIdAndUpdate(

                // Trả về dữ liệu mới 
                { _id: new Types.ObjectId(id) },  // hoặc new mongoose.Types.ObjectId(id) -> điều kiện tìm kiếm 
                { username, password, phone, email, address }, // dữ liệu trả về
                { new: true, upsert: false }); //các tùy chọn

            if (!updateUser)
                return res.status(404).json({ message: " Error updating user " });

            res.status(200).json(updateUser);
        }

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// Delete user bằng id
const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id as string)) {
            res.status(400).json({ message: "Bad Request" })
        } else {
            await User.findOneAndDelete({ _id: new Types.ObjectId(id) });
            res.json({ message: " User delete success " });
        }
    } catch (error) {
        res.status(400).json({ message: " Error deleting user" });
    }
};

export { createUser, getUser, getAllUser, deleteUser, updateUser, login };

