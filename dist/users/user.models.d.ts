import mongoose from "mongoose";
export declare const User: mongoose.Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    email: string;
    room: string;
    phone?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    email: string;
    room: string;
    phone?: string | null;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    email: string;
    room: string;
    phone?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    email: string;
    room: string;
    phone?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    email: string;
    room: string;
    phone?: string | null;
}>> & mongoose.FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    username: string;
    password: string;
    email: string;
    room: string;
    phone?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
//# sourceMappingURL=user.models.d.ts.map