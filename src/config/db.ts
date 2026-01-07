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



// 1. Tắt bufferCommands để bắt lỗi ngay lập tức nếu mất kết nối
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
    // 2. Nếu đã kết nối rồi thì không kết nối lại
    if (mongoose.connection.readyState >= 1) return;

    try {
        // 3. Đợi cho đến khi kết nối thành công mới cho phép code chạy tiếp
        await mongoose.connect(process.env.DB_URL as string);
        console.log("✅ MongoDB đã kết nối thành công");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        // Quan trọng: Ném lỗi ra ngoài để Vercel biết và thử lại (retry)
        throw error; 
    }
};