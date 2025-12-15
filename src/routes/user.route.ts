import express from "express"
import { login, createUser,getUserById, getUser, deleteUser, updateUser } from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { refreshTokenController } from "../middleware/refreshtoken"
import { logout } from "../middleware/logout"
import { createRoom, getRoom, updateRoom, deleteRoom } from "../controller/room.controller"
const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/create", createUser);
router.post("/refresh-token", refreshTokenController);

// Private routes
router.use(authMiddleware);

// Post routes
router.post("/createRoom", createRoom)

// Get routes
router.get("/getUser", getUser);
router.get("/getUser/:id", getUserById);
router.get("/getRoom", getRoom)

// Put routes
router.put("/update", updateUser);
router.put("/update/:id", updateUser);
router.patch("/updateRoom/:roomNum", updateRoom)

// Delete routes
router.delete("/delete/:id", deleteUser);
router.delete("/deleteRoom/:roomNum", deleteRoom)
router.post("/logout", logout);

export default router;



