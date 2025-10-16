import type { Request, Response } from "express";
import User from "../users/user.models"
import bcrypt from "bcryptjs";
import {createToken, createRefreshToken }from "../utils/jwt"
import { error } from "console";

export {createUser, getUserById, getAllUser, deleteUser, updateUser};


const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra username có tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }

    // Tạo user mới — KHÔNG cần tạo id thủ công
    const newUser = new User({
      username,
      password,    // _id sẽ được MongoDB tự sinh (kiểu ObjectId)
    });

    await newUser.save();

    // 4️⃣ Phản hồi thành công
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
        const user = await User.findOne({id:req.params.id});
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
//  const login = async (req : Request, res : Response) => {

//     const {username, password} = req.body;

//     // Tìm User trong DATABASE 
//     const user = await User.findOne({username});
//     if(!user) return res.status(404).json({message : " User not found"});

//     // So sánh mật khẩu nhập với mật khẩu hash trong DB
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//         return res.status(401).json({ message: "Wrong password" });

//     // Tạo token để đăng nhập
//     const token = createToken(user.id);
//     const refreshToken = createRefreshToken(user.id);
//     res.json({message : "Login successful", token, refreshToken});
// }

