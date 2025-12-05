import mongoose from "mongoose";
export declare const User: mongoose.Model<{
    username: string;
    password: string;
    role: "admin" | "user";
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    username: string;
    password: string;
    role: "admin" | "user";
}, {}, mongoose.DefaultSchemaOptions> & {
    username: string;
    password: string;
    role: "admin" | "user";
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
    role: "admin" | "user";
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    username: string;
    password: string;
    role: "admin" | "user";
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    username: string;
    password: string;
    role: "admin" | "user";
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=user.models.d.ts.map