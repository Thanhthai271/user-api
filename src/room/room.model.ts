
import mongoose from "mongoose";


const roomSchema = new mongoose.Schema({
    roomNum: { type: String, required: true, unique: true },
    group: { type: String, required: true },
    price: { type: String, required: true },
    deposit: { type: String, required: true },
    occupants: { type: String, required: true },
    checkinDate: { type: String, required: true },
    contractTerm: { type: String, required: true },
    status: { type: String, required: true },
    createBill: { type: String }
},
    { timestamps: true }
)

export const Room = mongoose.model("Room", roomSchema)


