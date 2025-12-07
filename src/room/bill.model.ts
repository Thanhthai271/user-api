import mongoose from "mongoose";
import { tr } from "zod/v4/locales";

const billSchema = new mongoose.Schema({
    roomNum: { type: String, required: true },
    price: { type: String, required: true },
    elecPrice: { type: String, required: true },
    waterPrice: { type: String, required: true },
    wifiPrice: { type: String, required: true },
    totalPrice: { type: String },
    status: { type: String },
    getBill: { type: String }
},
    { timestamps: true }
)

export const Bill = mongoose.model("Bill", billSchema)