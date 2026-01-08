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

// Biến cache để lưu kết nối, tránh kết nối lại nhiều lần trên Vercel

export const connectDB = async () => {
    // Nếu đã kết nối, không làm gì cả
    if (mongoose.connection.readyState >= 1) return;

    try {
        // Sử dụng URI trực tiếp từ biến môi trường
        const uri = process.env.DB_URL;
        if (!uri) throw new Error("Chưa có biến DB_URL");

        await mongoose.connect(uri);
        console.log("✅ Kết nối DB thành công");
    } catch (error) {
        console.error("❌ Lỗi DB:", error);
        // Không throw lỗi ở đây để tránh làm chết instance của Vercel
    }
};