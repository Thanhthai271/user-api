import mongoose from "mongoose";

export const connectDB = async () => {  
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/troroom_db");
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB connection failed", err);
        process.exit(1);
    }
};