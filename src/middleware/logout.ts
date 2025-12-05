import type { Request, Response } from "express";
import { User } from "../users/user.models";

const logout = async (req: Request, res: Response) => {
    try {
        const tokenToRemove = req.cookies.refreshToken;

        if (!tokenToRemove) {
            return res.json({ message: "Không tìm thấy Token để đăng xuất" })
        }

        await User.findOneAndDelete(
            { refreshToken: tokenToRemove }
        )

        res.clearCookie("refreshToken", {
            httpOnly: true,
            path: "/",
            secure: false
        })

        return res.status(200).json({ message: "Đăng xuất thành công" })

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" })
    }
}

export { logout }