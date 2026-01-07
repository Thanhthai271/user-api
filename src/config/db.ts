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
    if (mongoose.connection.readyState >= 1) return;

    try {
        // BƯỚC 2: Để mặc định để Mongoose tự tối ưu kết nối trên Vercel
        await mongoose.connect(process.env.DB_URL as string); 
        console.log("MongoDB đã kết nối thành công");
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error);
    }
};