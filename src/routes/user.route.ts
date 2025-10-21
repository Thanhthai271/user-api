import express from "express"
import { login, createUser, getAllUser, getUser, deleteUser, updateUser} from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router =  express.Router();

router.post("/login", login);

router.use(authMiddleware);


router.post("/create", createUser);
router.get("/", getAllUser);    
router.get("/search/:id", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;


