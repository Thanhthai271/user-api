
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../utils/jwt";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    if (req.headers && req.headers.authorization) {
        //lấy token
        const accesToken = req.headers.authorization.split(' ')[1];

        //xác thực token
        try {
            const decoded = jwt.verify(accesToken as string, SECRET_KEY as string)
            if (!decoded) {
                res.status(401).json({ message: "Sai token hoặc khóa bí mật" })
            }
            next();
        } catch (err) {
            res.status(401).json({ message: "Thiếu hoặc sai định dạng token" })
        }
    } else {
        res.status(401).json({ message: "Undefind Token" })
    }
}

export { authMiddleware }; 