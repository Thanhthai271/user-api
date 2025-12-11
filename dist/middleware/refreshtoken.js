"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = void 0;
const user_models_1 = require("../users/user.models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const refreshTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: "Không có refreshToken" });
        }
        const user = await user_models_1.User.findOne({ refreshTokens: refreshToken });
        if (!user) {
            return res.status(403).json({ message: "Không có người dùng" });
        }
        let decoded = null;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, jwt_1.SECRET_KEY_REFRESH);
        }
        catch (err) {
            return res.status(401).json({ message: "Refresh token hết hạn hoặc sai" });
        }
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        const newAccessToken = jsonwebtoken_1.default.sign(payload, jwt_1.SECRET_KEY, { expiresIn: "1d" });
        return res.status(200).json({
            accessToken: newAccessToken,
            message: "Cấp accessToken mới thành công"
        });
    }
    catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.refreshTokenController = refreshTokenController;
//# sourceMappingURL=refreshtoken.js.map