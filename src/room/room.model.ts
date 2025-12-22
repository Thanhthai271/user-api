
import mongoose from "mongoose";


const roomSchema = new mongoose.Schema({
    roomNum: { type: String, required: true},
    group: { type: String, required: true },
    price: { type: String, required: true },
    deposit: { type: String },
    occupants: { type: String },
    checkinDate: { type: String },
    contractTerm: { type: String },
    status: { type: String, required: true },
    createBill: { type: String }
},
    { timestamps: true }
)

export const Room = mongoose.model("Room", roomSchema)
