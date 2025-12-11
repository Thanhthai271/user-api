"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.getRoom = exports.createRoom = void 0;
const room_model_1 = require("../room/room.model");
const createRoom = async (req, res) => {
    try {
        console.log("📥 BODY NHẬN ĐƯỢC:", req.body);
        const { roomNum, group, price, deposit, occupants, checkinDate, contractTerm, status } = req.body;
        const existingRoom = await room_model_1.Room.findOne({ roomNum });
        console.log("🔍 EXISTING:", existingRoom);
        if (existingRoom) {
            return res.status(400).json({ message: "Room already exists" });
        }
        const newRoom = new room_model_1.Room({
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
    }
    catch (err) {
        console.log("❌ ERROR TRONG CREATEROOM:", err);
        res.status(500).json({ message: "server error", error: err });
    }
};
exports.createRoom = createRoom;
const getRoom = async (req, res) => {
    try {
        const limitDefault = 10;
        const limit = parseInt(req.query.limit) || limitDefault;
        const offset = parseInt(req.query.offset) || 0;
        const page = parseInt(req.query.page) || Math.floor(offset / limit) + 1;
        const skip = parseInt(req.query.skip) || (page - 1) * limit;
        const searchText = req.query.search;
        if (req.query.limit && isNaN(Number(req.query.limit))) {
            return res.status(400).json({ message: 'limit must be number' });
        }
        if (req.query.page && isNaN(Number(req.query.page))) {
            return res.status(400).json({ message: 'page must be number' });
        }
        if (req.query.offset && isNaN(Number(req.query.offset))) {
            return res.status(400).json({ message: 'offset must be number' });
        }
        if (req.query.searchText && typeof req.query.searchText !== "string") {
            return res.status(400).json({ message: 'searchtext' });
        }
        const matchStage = searchText ? {
            $match: { roomNum: { $regex: searchText, $options: 'i' } }
        }
            : { $match: {} };
        const countPromise = room_model_1.Room.aggregate([
            matchStage,
            { $count: 'total' }
        ]);
        const findPromise = room_model_1.Room.aggregate([
            matchStage,
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]);
        const [countRoom, rooms] = await Promise.all([countPromise, findPromise]);
        const totalRoom = countRoom.length > 0 ? countRoom[0].total : 0;
        const totalPages = Math.ceil(totalRoom / limit);
        res.status(200).json({
            rooms,
            pagination: {
                totalRoom,
                skip,
                limit,
                page,
                totalPages
            }
        });
    }
    catch (err) {
        console.log('error : ', err);
        return res.status(500).json({ message: 'server error' });
    }
};
exports.getRoom = getRoom;
const updateRoom = async (req, res) => {
    const roomNum = req.params;
    const { group, price, deposit, occupants, checkinDate, contractTerm, status } = req.body;
    if (!roomNum) {
        return res.status(400).json({ message: 'user not found' });
    }
    const updateRoom = await room_model_1.Room.findOneAndUpdate({ roomNum }, { roomNum, group, price, deposit, occupants, checkinDate, contractTerm, status }, { new: true, upsert: false });
    res.status(200).json({ message: 'updated success', updateRoom });
};
exports.updateRoom = updateRoom;
const deleteRoom = async (req, res) => {
    try {
        const { roomNum } = req.params;
        if (!roomNum || roomNum.trim() === "") {
            return res.status(400).json({ message: "Room not found or required" });
        }
        await room_model_1.Room.findOneAndDelete({ roomNum });
        return res.status(200).json({ message: 'Deleted room success' });
    }
    catch (err) {
        console.log("error :", err);
        return res.status(500).json({ message: "server error" });
    }
};
exports.deleteRoom = deleteRoom;
//# sourceMappingURL=room.controller.js.map