import { Room } from "../room/room.model";
import { Bill } from "../room/bill.model";
import type { Response, Request } from "express";

const createRoom = async (req: Request, res: Response) => {
    try {
        console.log("📥 BODY NHẬN ĐƯỢC:", req.body);

        const { roomNum, group, price, deposit, occupants, checkinDate, contractTerm, status } = req.body;
        
        const existingRoom = await Room.findOne({ roomNum });
        console.log("🔍 EXISTING:", existingRoom);

        if (existingRoom) {
            return res.status(400).json({ message: "Room already exists" });
        }

        const newRoom = new Room({
            roomNum,
            group,
            price,
            deposit,
            occupants,
            checkinDate,
            contractTerm,
            status
        });

        console.log("💾 SAVING ROOM:", newRoom);

        await newRoom.save();

        res.status(200).json({
            message: "Create Room Success",
            room: newRoom,
        });

    } catch (err) {
        console.log("❌ ERROR TRONG CREATEROOM:", err);
        res.status(500).json({ message: "server error", error: err });
    }
};


export {createRoom}
