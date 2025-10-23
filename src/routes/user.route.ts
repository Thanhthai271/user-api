import express from "express"
import { login, createUser, getAllUser, getUser, deleteUser, updateUser} from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router =  express.Router();

router.post("/login", login);
router.post("/create", createUser);

router.use(authMiddleware);

router.get("/", getAllUser);    
router.get("/search/:id", getUser);
router.get("/search", getUser);
router.put("/update", updateUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.delete("/delete", deleteUser);

export default router;


