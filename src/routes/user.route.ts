import express from "express"
import { login, createUser,getUserById, getUser, deleteUser, updateUser } from "../controller/user.controller"
import { authMiddleware } from "../middleware/auth.middleware"
import { refreshTokenController } from "../middleware/refreshtoken"
import { logout } from "../middleware/logout"
import { createRoom, getRoom, updateRoom, deleteRoom } from "../controller/room.controller"
import { createBill,payBill,getAllBills, deleteBill } from "../controller/bill.controller"

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/create", createUser);
router.post("/refresh-token", refreshTokenController);

// Private routes
router.use(authMiddleware);

// Post routes
router.post("/createRoom", createRoom)
router.post("/createBill", createBill)
router.post("/logout", logout);

// Get routes
router.get("/getUser", getUser);
router.get("/getUser/:id", getUserById);
router.get("/getRoom", getRoom)
router.get("/getAllBills", getAllBills)

// Put routes
router.patch("/update", updateUser);
router.patch("/update/:id", updateUser);
router.patch("/updateRoom/:roomNum", updateRoom)
router.patch("/payBill/:id", payBill)

// Delete routes
router.delete("/delete/:id", deleteUser);
router.delete("/deleteRoom/:roomNum", deleteRoom)
router.delete("/deleteBill/:id", deleteBill)

export default router;



