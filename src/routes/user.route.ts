import express from "express"
import { login, createUser, getAllUser, getUser, deleteUser, updateUser} from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router =  express.Router();

router.post("/login", login);

// console.log(">>> Router user loaded"); // kiểm tra router có mount không

// router.use((req, res, next) => {
//   console.log(">>> Router matched:", req.path);
//   next();
// });

router.use(authMiddleware);


router.post("/create", createUser);
router.get("/", getAllUser);    
router.get("/search/:id", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:username", deleteUser);

export default router;


