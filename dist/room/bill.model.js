"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const billSchema = new mongoose_1.default.Schema({
    roomNum: { type: String, required: true },
    price: { type: String, required: true },
    elecPrice: { type: String, required: true },
    waterPrice: { type: String, required: true },
    wifiPrice: { type: String, required: true },
    totalPrice: { type: String },
    status: { type: String },
    getBill: { type: String }
}, { timestamps: true });
exports.Bill = mongoose_1.default.model("Bill", billSchema);
//# sourceMappingURL=bill.model.js.map