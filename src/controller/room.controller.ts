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

const getRoom = async (req: Request, res: Response) => {
    try {
        const limitDefault = 10;
        const limit = parseInt(req.query.limit as string) || limitDefault;
        const offset = parseInt(req.query.offset as string) || 0;
        const page = parseInt(req.query.page as string) || Math.floor(offset / limit) + 1;
        const skip = parseInt(req.query.skip as string) || (page - 1) * limit
        const searchText = req.query.search as string

        if (req.query.limit && isNaN(Number(req.query.limit))) {
            return res.status(400).json({ message: 'limit must be number' })
        }

        if (req.query.page && isNaN(Number(req.query.page))) {
            return res.status(400).json({ message: 'page must be number' })
        }

        if (req.query.offset && isNaN(Number(req.query.offset))) {
            return res.status(400).json({ message: 'offset must be number' })
        }

        if (req.query.searchText && typeof req.query.searchText !== "string") {
            return res.status(400).json({ message: 'searchtext' })
        }

        const matchStage = searchText ? {
            $match: { roomNum: { $regex: searchText, $options: 'i' } }
        }

            : { $match: {} }

        const countPromise = Room.aggregate([
            matchStage,
            { $count: 'total' }
        ])

        const findPromise = Room.aggregate([
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ])

        const [countRoom, rooms] = await Promise.all([countPromise, findPromise])
        const totalRoom = countRoom.length > 0 ? countRoom[0].total : 0
        const totalPages = Math.ceil(totalRoom / limit)

        res.status(200).json({
            rooms,
            pagination: {
                totalRoom,
                skip,
                limit,
                page,
                totalPages
            }
        })
    } catch (err) {
        console.log('error : ', err)
        return res.status(500).json({ message: 'server error' })
    }
}

const updateRoom = async (req: Request, res: Response) => {
    const roomNum = req.params;
    const { group, price, deposit, occupants, checkinDate, contractTerm, status } = req.body
    if (!roomNum) {
        return res.status(400).json({ message: 'user not found' })
    }

    const updateRoom = await Room.findOneAndUpdate(
        { roomNum },
        { roomNum, group, price, deposit, occupants, checkinDate, contractTerm, status },
        { new: true, upsert: false }
    )

    res.status(200).json({ message: 'updated success', updateRoom })
}

const deleteRoom = async (req: Request, res: Response) => {
    try {
        const { roomNum } = req.params;
        if (!roomNum || roomNum.trim() === "") {
            return res.status(400).json({ message: "Room not found or required" })
        }
        await Room.findOneAndDelete({ roomNum })
        return res.status(200).json({ message: 'Deleted room success'})
    } catch (err) {
        console.log("error :", err)
        return res.status(500).json({ message: "server error" })
    }
}

export { createRoom, getRoom, updateRoom, deleteRoom, }
