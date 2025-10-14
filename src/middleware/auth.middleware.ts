import { error } from "console";
import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"

const SECRET = "MY_SECRET_KEY";

export const authMiddLeware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({message: "No token provided"});

    try {
        const decoded = jwt.verify(token, SECRET);
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(403).json({message : "Invalid token"});
    } 
};