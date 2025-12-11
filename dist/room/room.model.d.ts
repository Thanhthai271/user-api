import mongoose from "mongoose";
export declare const Room: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    group: string;
    price: string;
    deposit: string;
    occupants: string;
    checkinDate: string;
    contractTerm: string;
    status: string;
    createBill?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    group: string;
    price: string;
    deposit: string;
    occupants: string;
    checkinDate: string;
    contractTerm: string;
    status: string;
    createBill?: string | null;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    group: string;
    price: string;
    deposit: string;
    occupants: string;
    checkinDate: string;
    contractTerm: string;
    status: string;
    createBill?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    group: string;
    price: string;
    deposit: string;
    occupants: string;
    checkinDate: string;
    contractTerm: string;
    status: string;
    createBill?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    group: string;
    price: string;
    deposit: string;
    occupants: string;
    checkinDate: string;
    contractTerm: string;
    status: string;
    createBill?: string | null;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    roomNum: string;
    group: string;
    price: string;
    deposit: string;
    occupants: string;
    checkinDate: string;
    contractTerm: string;
    status: string;
    createBill?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=room.model.d.ts.map