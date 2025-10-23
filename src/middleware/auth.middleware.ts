import { error } from "console";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../utils/jwt";
 

const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    
    // console.log(">>> headers:", req.headers); // Thêm dòng này

    if(req.headers && req.headers.authorization){
        //lấy token
        const token = req.headers.authorization.split(' ')[1];
        //xác thực token
        try {
            const decoded = jwt.verify(token as string, SECRET_KEY as string)
            next();
        }catch(err){
            res.status(401).json({message: "Thiếu hoặc sai định dạng token"})
        }
    }else{
        res.status(401).json({message: "Undefind"})
    }

}

export {authMiddleware}; 