import mongoose from "mongoose";
export declare const Bill: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    price: string;
    elecPrice: string;
    waterPrice: string;
    wifiPrice: string;
    status?: string | null;
    totalPrice?: string | null;
    getBill?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    price: string;
    elecPrice: string;
    waterPrice: string;
    wifiPrice: string;
    status?: string | null;
    totalPrice?: string | null;
    getBill?: string | null;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    price: string;
    elecPrice: string;
    waterPrice: string;
    wifiPrice: string;
    status?: string | null;
    totalPrice?: string | null;
    getBill?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    price: string;
    elecPrice: string;
    waterPrice: string;
    wifiPrice: string;
    status?: string | null;
    totalPrice?: string | null;
    getBill?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    price: string;
    elecPrice: string;
    waterPrice: string;
    wifiPrice: string;
    status?: string | null;
    totalPrice?: string | null;
    getBill?: string | null;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    price: string;
    elecPrice: string;
    waterPrice: string;
    wifiPrice: string;
    status?: string | null;
    totalPrice?: string | null;
    getBill?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=bill.model.d.ts.map