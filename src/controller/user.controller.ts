import type { Request, Response } from "express";
import User from "../users/user.models"
import bcrypt from "bcryptjs";
import { createToken, createRefreshToken }from "../utils/jwt"
import { error } from "console";
import { id } from "zod/v4/locales";
import userModels from "../users/user.models";
import crypto from "crypto";
import { jwt } from "zod";


const login = async (req : Request, res : Response) => {
    try {
        const secretKey = "Etz/OLteop3NC42sh493AFQ7sYRmzcobRMlcBXoUhs+VrzJod4RVxARp5xQxB+k36se0pu7ZaXvSjRh8mYtUpZWhL/sWMNFIUMGvkzl9uWGUVJOtcykaYhLQhrkRe7IqD0Bjde32YoDbISZlNi83r4/8KrB1RdEOFXnZYUzebRhUnHXXQOFNNlXfymSsW8N4WlIqbng8fc7d4hNc1tadVtvLCU2+avZix73CnS0iJDQjonzDfeahNuqP6/qcE88fRH5WywWymp5dzEk+To+NMW2JMw0EKs16NDM4UsDXHVAdS4hmxDja8/Q6mqDbkyOkxYqKHXritKQzzFqZshs7Cg==";
        const {username, password} = req.body;
        const user = await User.find({username, password});

        if (!user) {
            return res.status(404).json({message : "Sai username hoặc password"})
        }
        res.status(200).json({message : "Đăng nhập thành công"})

        const header = {
        alg : "hmac256", 
        typ : "JWT",
    };

    const payload = {
        sub : user,
        exp : Date.now() + 3600000,
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));

    const tokenData = `${encodedHeader}.${encodedPayload}`;

    const hmac = crypto.createHmac("sha256", secretKey);
    const signature = hmac.update(tokenData).digest("base64url");
        res.json({
            token : `${tokenData}.${signature}` 
        });

    } catch (err) {
        res.status(500).json({message : "Lỗi server", err});
    }  
};


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


// Tìm user bằng ID
 const getUserById = async (req : Request, res : Response) => {
    try {
        const {id} = req.params;
        // const {username, email} = req.body;
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
        const {username, password, phone, email, address} = req.body;
        const updateUser = await User.findByIdAndUpdate(

            // Trả về dữ liệu mới 
            id,  // hoặc new mongoose.Types.ObjectId(id) -> điều kiện tìm kiếm 
            {username, password, phone, email, address}, // dữ liệu trả về
            {new : true, upsert : false}); //các tùy chọn

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

export {createUser, getUserById, getAllUser, deleteUser, updateUser, login};

