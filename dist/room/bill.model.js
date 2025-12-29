"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bill = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const billSchema = new mongoose_1.default.Schema({
    roomNum: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    deposit: { type: Number, required: true },
    elecPrice: { type: Number, required: true },
    waterPrice: { type: Number, required: true },
    wifiPrice: { type: Number, required: true },
    totalPrice: { type: Number },
    status: {
        type: String, required: true
    }
}, { timestamps: true });
exports.Bill = mongoose_1.default.model("Bill", billSchema);
//# sourceMappingURL=bill.model.js.map