import type { Request, Response } from "express";
import User from "../users/user.models"
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
        const { username, password } = req.body || {} ;

        if (id) {
            if (!Types.ObjectId.isValid(id as string)) {
                res.status(400).json({ message: "Bad request, try by username or email" })
            }
            const getUserById = await User.findById(new Types.ObjectId(id as string))
            if (!getUserById) {
                return res.status(404).json({ message: "User not found, try by username or email" });
            }
            return res.json(getUserById);
        }

        const getUser = await User.findOne({ $or: [{ username }, { password }] });
        if (!getUser) {
            return res.status(404).json({ message: "User not found, try by id" });
        }
        return res.json(getUser)

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


// Update user 
const updateUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { username, password, phone, email, address } = req.body || {};

        if (id) {
            if (!Types.ObjectId.isValid(id as string)) {
                res.status(400).json({ message: "Bad request, try again" })
            }
            const updateUserbyid = await User.findByIdAndUpdate(
                { _id: new Types.ObjectId(id) },
                { username, password, phone, email, address },
                { new: true, upsert: false }
            );

            if (!updateUserbyid) {
                return res.status(404).json({ message: "User not found, try by username or email" });
            }
            return res.json(updateUserbyid);
        }

        const updateUser = await User.findOneAndUpdate(
            { _id: new Types.ObjectId(id) },
            { username, password, phone, email, address },
            { new: true, upsert: false }
        );

        if (!updateUser) {
            return res.status(404).json({ message: "User not found, try by id" });
        }
        return res.json(updateUser);

    } catch (error) {
        console.error("❌ update error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


// Delete user 
const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body || {};

        if (id) {
            if (!Types.ObjectId.isValid(id as string)) {
                return res.status(400).json({ message: "Bad Request, try by username or email" })
            }
            const user = await User.findOneAndDelete({ _id: new Types.ObjectId(id) });
            if (!user) {
                return res.json({ message: "User not found, try by username or email" });
            }
            return res.json({ message: " User delete success " });
        }

        if (!username && !email) {
            return res.json({ message: "Missing username or email" })
        }

        if (username || email) {
            await User.findOneAndDelete({ $or: [{ username }, { email }] })
            return res.json({ message: "User delete success " });
        }

    } catch (error) {
        console.error("❌ Delete error:", error);
        res.status(500).json({ message: " Error deleting user" });
    }
};


export { createUser, getUser, getAllUser, deleteUser, updateUser, login };

