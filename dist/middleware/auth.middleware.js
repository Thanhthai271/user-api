"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        //lấy token
        const accesToken = req.headers.authorization.split(' ')[1];
        //xác thực token
        try {
            const decoded = jsonwebtoken_1.default.verify(accesToken, jwt_1.SECRET_KEY);
            if (!decoded) {
                res.status(401).json({ message: "Sai token hoặc khóa bí mật" });
            }
            next();
        }
        catch (err) {
            res.status(401).json({ message: "Thiếu hoặc sai định dạng token" });
        }
    }
    else {
        res.status(401).json({ message: "Undefind Token" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map