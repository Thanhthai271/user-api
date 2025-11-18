import type { Request, Response } from "express";
import { User } from "../users/user.models";

const logout = async (req: Request, res: Response) => {
    try {
        const tokenToRemove = req.body.refreshToken;

        if (!tokenToRemove) {
            return res.status(400).json({ message: "không tìm thấy refreshToken" })
        }

        const result = await User.updateOne(
            { refreshTokens : tokenToRemove },
            { $pull: { refreshTokens: tokenToRemove } }
        )

    if (result.modifiedCount === 0) {
        return res.json({message: "Không tìm thấy Token để đăng xuất"})
    }    
        return res.status(200).json({ message: "Đăng xuất thành công" })

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" })
    }
}

export {logout}