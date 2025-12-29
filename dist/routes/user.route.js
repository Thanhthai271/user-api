"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const refreshtoken_1 = require("../middleware/refreshtoken");
const logout_1 = require("../middleware/logout");
const room_controller_1 = require("../controller/room.controller");
const bill_controller_1 = require("../controller/bill.controller");
const router = express_1.default.Router();
// Public routes
router.post("/login", user_controller_1.login);
router.post("/create", user_controller_1.createUser);
router.post("/refresh-token", refreshtoken_1.refreshTokenController);
// Private routes
router.use(auth_middleware_1.authMiddleware);
// Post routes
router.post("/createRoom", room_controller_1.createRoom);
router.post("/createBill", bill_controller_1.createBill);
router.post("/logout", logout_1.logout);
// Get routes
router.get("/getUser", user_controller_1.getUser);
router.get("/getUser/:id", user_controller_1.getUserById);
router.get("/getRoom", room_controller_1.getRoom);
router.get("/getAllBills", bill_controller_1.getAllBills);
// Put routes
router.patch("/update", user_controller_1.updateUser);
router.patch("/update/:id", user_controller_1.updateUser);
router.patch("/updateRoom/:roomNum", room_controller_1.updateRoom);
router.patch("/payBill/:id", bill_controller_1.payBill);
// Delete routes
router.delete("/delete/:id", user_controller_1.deleteUser);
router.delete("/deleteRoom/:roomNum", room_controller_1.deleteRoom);
router.delete("/deleteBill/:id", bill_controller_1.deleteBill);
exports.default = router;
//# sourceMappingURL=user.route.js.map