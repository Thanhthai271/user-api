"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const user_models_1 = require("../users/user.models");
const logout = async (req, res) => {
    try {
        const tokenToRemove = req.cookies.refreshToken;
        if (!tokenToRemove) {
            return res.json({ message: "Không tìm thấy Token để đăng xuất" });
        }
        await user_models_1.User.findOneAndDelete({ refreshToken: tokenToRemove });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            path: "/",
            secure: false
        });
        return res.status(200).json({ message: "Đăng xuất thành công" });
    }
    catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.logout = logout;
//# sourceMappingURL=logout.js.map