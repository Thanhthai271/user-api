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
const router = express_1.default.Router();
// Public routes
router.post("/login", user_controller_1.login);
router.post("/create", user_controller_1.createUser);
router.post("/refresh-token", refreshtoken_1.refreshTokenController);
router.post("/createRoom", room_controller_1.createRoom);
router.get("/getRoom", room_controller_1.getRoom);
router.patch("/updateRoom/:roomNum", room_controller_1.updateRoom);
router.delete("/deleteRoom/:roomNum", room_controller_1.deleteRoom);
// Private routes
router.use(auth_middleware_1.authMiddleware);
// Get routes
// router.get("/search", getUser);
// router.get("/search/:id", getUserById);
// Put routes
router.put("/update", user_controller_1.updateUser);
router.put("/update/:id", user_controller_1.updateUser);
// Delete routes
router.delete("/delete/:id", user_controller_1.deleteUser);
router.post("/logout", logout_1.logout);
exports.default = router;
//# sourceMappingURL=user.route.js.map