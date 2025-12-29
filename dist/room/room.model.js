"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    roomNum: { type: String, required: true },
    group: { type: String, required: true },
    price: { type: String, required: true },
    deposit: { type: String },
    occupants: { type: String },
    checkinDate: { type: String },
    contractTerm: { type: String },
    status: { type: String, required: true },
    createBill: { type: String }
}, { timestamps: true });
exports.Room = mongoose_1.default.model("Room", roomSchema);
//# sourceMappingURL=room.model.js.map