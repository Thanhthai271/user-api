import express from "express";
import { register, login, getUsers } from "../controller/user.controller";
import { authMiddLeware } from "../middleware/auth.middleware";
const router = express.Router();
// Tạo tài khoản, đăng kí
router.post("/register", register);
// đăng nhập hệ thống
router.post("/login", login);
// có authmid ở giữa để kiểm tra khi client gửi request đến, 
router.get("/", authMiddLeware, getUsers);
// middleware sẽ chạy trước để kiểm tra quyền truy cập.
export default router;
//# sourceMappingURL=user.route.js.map