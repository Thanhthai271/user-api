import express from "express"
import { login, createUser, getAllUser, getUser, deleteUser, updateUser} from "../controller/user.controller"
import { authMiddLeware } from "../middleware/auth.middleware"
import userModels from "../users/user.models";

const router =  express.Router();

router.post("/login", login);
router.post("/create", createUser);
router.get("/", getAllUser);    
router.get("/search/:id", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:username", deleteUser);

export default router;

// // có authmid ở giữa để kiểm tra khi client gửi request đến, 
// router.get("/", authMiddLeware, getAllUsers) 
// // middleware sẽ chạy trước để kiểm tra quyền truy cập.


