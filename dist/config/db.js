import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/user_api");
        console.log("MongoDB Connected");
    }
    catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map