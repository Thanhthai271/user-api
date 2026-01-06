import mongoose from "mongoose";
import dotenv from "dotenv"

// dotenv.config()
// export const connectDB = async () => {  
//     try {
//         await mongoose.connect(process.env.DB_URL as string);
//         console.log("MongoDB Connected");
//     } catch (err) {
//         console.error("MongoDB connection failed", err);
//         process.exit(1);
//     }
// };

export const connectDB = async () => {   
    const url = process.env.DB_URL;
    if (!url || !url.startsWith("mongodb")) {
        console.error("URI sai định dạng:", url);
        return;
    }
    try {
        await mongoose.connect(url);
        console.log("MongoDB Connected Successfully");
    } catch (err : any ) {
        console.error("Lỗi kết nối thực tế:", err.message);
    }
};