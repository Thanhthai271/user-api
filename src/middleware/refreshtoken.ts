import { User } from "../users/user.models"
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY, SECRET_KEY_REFRESH } from "../utils/jwt";


const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "Không có refreshToken" })
        }

        const user = await User.findOne({ refreshTokens: refreshToken })
        if (!user) {
            return res.status(403).json({ message: "Không có người dùng" })
        }

        let decoded: any = null
        try {
            decoded = jwt.verify(refreshToken, SECRET_KEY_REFRESH as string);
        } catch (err) {
            return res.status(401).json({ message: "Refresh token hết hạn hoặc sai" });
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const newAccessToken = jwt.sign(
            payload,
            SECRET_KEY as string,
            { expiresIn: "1d" },
        )

        return res.status(200).json({
            accessToken: newAccessToken,
            message: "Cấp accessToken mới thành công"
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" })
    }
}

export { refreshTokenController }