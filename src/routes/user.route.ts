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

router.post("/createRoom", createRoom)
router.get("/getRoom", getRoom)
router.patch("/updateRoom/:roomNum", updateRoom)
router.delete("/deleteRoom/:roomNum", deleteRoom)

// Private routes
router.use(authMiddleware);

// Get routes
router.get("/getUser", getUser);
router.get("/getUser/:id", getUserById);


// Put routes
router.put("/update", updateUser);
router.put("/update/:id", updateUser);

// Delete routes
router.delete("/delete/:id", deleteUser);
router.post("/logout", logout);

export default router;



