"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBill = exports.payBill = exports.getAllBills = exports.createBill = void 0;
const bill_model_1 = require("../room/bill.model");
const room_model_1 = require("../room/room.model");
const createBill = async (req, res) => {
    try {
        const { roomNum, oldElectric, newElectric, electricUnit, waterPrice, wifiPrice } = req.body;
        const room = await room_model_1.Room.findOne({ roomNum });
        if (!room)
            return res.status(404).json({ message: "Không tìm thấy phòng" });
        const parseCurrency = (val) => {
            return parseFloat(val.replace(/[^0-9]/g, "")) || 0;
        };
        const roomPrice = parseCurrency((room.price ?? '0.đ'));
        const deposit = parseCurrency((room.deposit ?? '0.đ'));
        const elecUsage = Math.max(0, Number(newElectric) - Number(oldElectric));
        const totalElecPrice = elecUsage * Number(electricUnit);
        const totalWaterPrice = Number(waterPrice) || 0;
        const totalWifiPrice = Number(wifiPrice) || 0;
        //(Phòng + Điện + Nước + Wifi) - Cọc
        const subTotal = roomPrice + totalElecPrice + totalWaterPrice + totalWifiPrice;
        const finalTotal = Math.max(0, subTotal - deposit);
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const newBill = new bill_model_1.Bill({
            roomNum,
            price: roomPrice,
            deposit: deposit,
            elecPrice: totalElecPrice,
            waterPrice: totalWaterPrice,
            wifiPrice: totalWifiPrice,
            totalPrice: finalTotal,
            status: 'CHUA_THANH_TOAN',
            nextPaymentDue: nextMonth
        });
        await newBill.save();
        await room_model_1.Room.findOneAndUpdate({ roomNum }, { createBill: "YES", deposit: "0 đ" });
        res.status(201).json({ success: true, message: "Tạo hóa đơn và khấu trừ cọc thành công", data: newBill });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBill = createBill;
const payBill = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await bill_model_1.Bill.findByIdAndUpdate(id, { status: 'DA_THANH_TOAN', paymentDate: new Date() }, { new: true });
        if (!bill)
            return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
        // Cập nhật lại Room: Reset trạng thái createBill để tháng sau có thể tạo tiếp
        await room_model_1.Room.findOneAndUpdate({ roomNum: bill.roomNum }, { createBill: "" });
        res.status(200).json({ success: true, message: "Thanh toán thành công", data: bill });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.payBill = payBill;
const getAllBills = async (req, res) => {
    try {
        const bills = await bill_model_1.Bill.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bills });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBills = getAllBills;
const deleteBill = async (req, res) => {
    try {
        const { id } = req.params;
        await bill_model_1.Bill.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Deleted success' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Lỗi xóa hóa đơn" });
    }
};
exports.deleteBill = deleteBill;
//# sourceMappingURL=bill.controller.js.map