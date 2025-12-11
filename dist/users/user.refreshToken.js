"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenSchema = new mongoose_1.default.Schema({
    refreshToken: { type: String, unique: true },
    user: mongoose_1.default.Types.ObjectId,
    expiresAt: Date,
    createAt: Date,
}, { timestamps: true });
exports.RefreshToken = mongoose_1.default.model("RefreshToken", refreshTokenSchema);
//# sourceMappingURL=user.refreshToken.js.map