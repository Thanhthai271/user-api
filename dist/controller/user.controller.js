import { User } from "../models/user.models";
import bcrypt from "bcryptjs";
import { createToken, createRefreshToken } from "../utils/jwt";
export const register = async (req, res) => {
    const { username, password } = req.body;
    // Kiểm tra xem user đã tồn tại chưa 
    try {
        const exists = await User.findOne({ username });
        if (exists)
            return res.status(400).json({ message: " User already exists" });
        // Tạo user mới 
        const newUser = await User.create({ username, password });
        // Phản hồi thành công
        res.json(newUser);
    }
    catch (err) {
        res.status(500).json({ message: " Error registering user ", err });
    }
};
export const login = async (req, res) => {
    const { username, password } = req.body;
    // Tìm User trong DATABASE 
    const user = await User.findOne({ username });
    if (!user)
        return res.status(404).json({ message: " User not found" });
    // So sánh mật khẩu nhập với mật khẩu hash trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(401).json({ message: "Wrong password" });
    // Tạo token để đăng nhập
    const token = createToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    res.json({ message: "Login successful", token, refreshToken });
};
// Tìm khách hàng
export const getUsers = async (req, res) => {
    const users = await User.find;
    return res.json(users);
};
//# sourceMappingURL=user.controller.js.map