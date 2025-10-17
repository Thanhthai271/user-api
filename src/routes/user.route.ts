import express from "express"
import { login, createUser, getAllUser, getUserById, deleteUser, updateUser} from "../controller/user.controller"
import { authMiddLeware } from "../middleware/auth.middleware"
import { connectDB } from "../config/db";
import userModels from "../users/user.models";

const router =  express.Router();



router.post("/", login);
router.post("/", createUser);
router.get("/", getAllUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


// // có authmid ở giữa để kiểm tra khi client gửi request đến, 
// router.get("/", authMiddLeware, getAllUsers) 
// // middleware sẽ chạy trước để kiểm tra quyền truy cập.

export default router;
