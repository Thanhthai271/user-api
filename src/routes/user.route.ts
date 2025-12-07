import express from "express"
import { login, createUser, getAllUser, getUser, deleteUser, updateUser } from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { refreshTokenController } from "../middleware/refreshtoken"
import { logout } from "../middleware/logout"
import { createRoom } from "../controller/room.controller"
const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/create", createUser);
router.post("/refresh-token", refreshTokenController);

router.post("/createRoom", createRoom)

// Private routes
router.use(authMiddleware);

// Get routes
router.get("/", getAllUser);
router.get("/search", getUser);
router.get("/search/:id", getUser);


// Put routes
router.put("/update", updateUser);
router.put("/update/:id", updateUser);

// Delete routes
router.delete("/delete/:id", deleteUser);
router.post("/logout", logout);

export default router;



