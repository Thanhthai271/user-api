import express from "express"
import { login, createUser, getAllUser, getUser, deleteUser, updateUser} from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import {refreshTokenController} from "../middleware/refreshtoken"
import { logout } from "../middleware/logout"

const router =  express.Router();

router.post("/login", login);
router.post("/create", createUser);

router.post("/refresh-token", refreshTokenController);

router.use(authMiddleware);

router.get("/", getAllUser);    
router.get("/search/:id", getUser);
router.get("/search", getUser);
router.put("/update", updateUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.delete("/delete", deleteUser);
router.post("/logout", logout);

export default router;


