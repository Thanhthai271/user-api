import type { Request, Response } from "express";
import User from "../users/user.models"
import bcrypt from "bcryptjs";
import {login, createToken, createRefreshToken }from "../utils/jwt"
import { error } from "console";
import { id } from "zod/v4/locales";

export {createUser, getUserById, getAllUser, deleteUser, updateUser, login};

const login = async (req : Request, res : Response) => {
    try {
        const {username, password} = req.body;
        const user = await User.find({username, password});

        if (!user) {
            return res.status(404).json({message : "Sai username hoặc password"})
        }
        res.status(200).json({message : "Đăng nhập thành công"})
    } catch (err) {
        res.status(500).json({message : "Lỗi server", err});
    }
};


const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, phone, email, address } = req.body;

    // Kiểm tra username có tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Tạo user mới — KHÔNG cần tạo id thủ công -> Object_id
    const newUser = new User({
      username,
      password,  
      phone,
      email,
      address
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


// Tìm user bằng ID
 const getUserById = async (req : Request, res : Response) => {
    try {
        const id = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(400).json({message : "user not found"});
        res.json(user);
    } catch (error) {
        res.status(500).json({message : " Error fetching user", error})
    }
};


//Lấy toàn bộ user
 const getAllUser = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        res.status(500).json({message : " Error fetching users ", error});
    }
};


// Update user bằng id
 const updateUser = async (req : Request, res : Response) => {
    try {
        const {id} = req.params;
        const {username, password} = req.body;
        const updateUser = await User.findOneAndUpdate(

            // Trả về dữ liệu mới 
            {id}, 
            {username, password},
            {new : true});

        if(!updateUser) 
            return res.status(404).json({message : " Error updating user "});

        res.status(200).json(updateUser);
    } catch (error) {
        res.status(500).json({message : "Server error", error});
    }
};


// Delete user bằng id
 const deleteUser = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        await User.findOneAndDelete({id});
        res.json({message : " User deleted "});
    } catch (error) {
        res.status(400).json({message : " Error deleting user"});
    }
};

