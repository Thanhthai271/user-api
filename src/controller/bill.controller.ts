import { Request, Response } from "express";
import { Bill } from "../room/bill.model";
import { Room } from "../room/room.model";

const createBill = async (req: Request, res: Response) => {
    try {
        const {
            roomNum,
            oldElectric,
            newElectric,
            electricUnit,
            waterPrice,
            wifiPrice
        } = req.body;

        const room = await Room.findOne({ roomNum });
        if (!room) return res.status(404).json({ message: "Không tìm thấy phòng" });

        const parseCurrency = (val: string) => {
            return parseFloat(val.replace(/[^0-9]/g, "")) || 0;
        };

        const roomPrice = parseCurrency(room.price);
        const deposit = parseCurrency(room.deposit);

        const elecUsage = Math.max(0, Number(newElectric) - Number(oldElectric));
        const totalElecPrice = elecUsage * Number(electricUnit);

        const totalWaterPrice = Number(waterPrice) || 0;
        const totalWifiPrice = Number(wifiPrice) || 0;

        //(Phòng + Điện + Nước + Wifi) - Cọc
        const subTotal = roomPrice + totalElecPrice + totalWaterPrice + totalWifiPrice;
        const finalTotal = Math.max(0, subTotal - deposit);

        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const newBill = new Bill({
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
        await Room.findOneAndUpdate(
            { roomNum },
            { createBill: "YES", deposit: "0 đ" }
        );

        res.status(201).json({ success: true, message: "Tạo hóa đơn và khấu trừ cọc thành công", data: newBill });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


const payBill = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findByIdAndUpdate(
            id,
            { status: 'DA_THANH_TOAN', paymentDate: new Date() },
            { new: true }
        );

        if (!bill) return res.status(404).json({ message: "Không tìm thấy hóa đơn" });

// Cập nhật lại Room: Reset trạng thái createBill để tháng sau có thể tạo tiếp
        await Room.findOneAndUpdate(
            { roomNum: bill.roomNum },
            { createBill: "" }
        );

        res.status(200).json({ success: true, message: "Thanh toán thành công", data: bill });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBills = async (req: Request, res: Response) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bills });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBill = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        await Bill.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: 'Deleted success' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { createBill, getAllBills, payBill, deleteBill }