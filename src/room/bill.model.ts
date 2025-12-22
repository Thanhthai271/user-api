import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
    roomNum: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    deposit: { type: Number, required: true },
    elecPrice: { type: Number, required: true },
    waterPrice: { type: Number, required: true },
    wifiPrice: { type: Number, required: true },
    totalPrice: { type: Number },
    status: {
        type: String, required : true
    }
},
    { timestamps: true }
)

export const Bill = mongoose.model("Bill", billSchema)