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
        const limitRaw = Number(req.query.limit as string)
        const offsetRaw = Number(req.query.offset as string)
        const pageRaw = Number(req.query.page as string)
        const skipRaw = Number(req.query.skip as string)
        const searchText = req.query.search as string

        if (req.query.limit !== undefined && (isNaN(Number(limitRaw)) || limitRaw < 0)) {
            return res.status(400).json({ message: 'limit must be non-negative number' })
        }

        if (req.query.page !== undefined && (isNaN(Number(pageRaw)) || pageRaw < 1)) {
            return res.status(400).json({ message: 'page must be non-negative number' })
        }

        if (req.query.offset !== undefined && (isNaN(offsetRaw) || offsetRaw < 0)) {
            return res.status(400).json({ message: 'offset must be non-negative number' })
        }

        if (req.query.skip !== undefined && (isNaN(skipRaw) || skipRaw < 0)) {
            return res.status(400).json({ message: 'skip must be non-negative number' })
        }

        if (req.query.search && typeof req.query.search !== "string") {
            return res.status(400).json({ message: 'searchtext' })
        }

        const limit = !isNaN(limitRaw) ? limitRaw : limitDefault
        const offset = !isNaN(offsetRaw) ? offsetRaw : 0
        const page = !isNaN(pageRaw) ? pageRaw : Math.floor(offset / limit) + 1
        const skip = !isNaN(skipRaw) ? skipRaw : (page - 1) * limit

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
            { $skip: skip || offset },
            { $limit: limit },
        ])

        const [countRoom, rooms] = await Promise.all([countPromise, findPromise])
        const totalRoom = countRoom.length > 0 ? countRoom[0].total : 0
        const totalPages = Math.ceil(totalRoom / limit)

        if (page > totalPages && totalRoom > 0) {
            return res.status(400).json({ message: `Hiện tại chỉ có ${totalPages} trang` })
        }

        res.status(200).json({
            rooms,
            pagination: {
                totalRoom,
                skip,
                offset,
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
    // SỬA LỖI: Phải destructuring { roomNum } thì mới lấy được giá trị string
    const { roomNum } = req.params;
    const { group, price, deposit, occupants, checkinDate, contractTerm, status } = req.body

    if (!roomNum) {
        return res.status(400).json({ message: 'roomNum not found' })
    }

    const updateRoom = await Room.findOneAndUpdate(
        { roomNum },
        { group, price, deposit, occupants, checkinDate, contractTerm, status },
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
        return res.status(200).json({ message: 'Deleted room success' })
    } catch (err) {
        console.log("error :", err)
        return res.status(500).json({ message: "server error" })
    }
}

export { createRoom, getRoom, updateRoom, deleteRoom, }