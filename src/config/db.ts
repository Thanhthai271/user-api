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



// Tắt buffering: Nếu không kết nối được sẽ báo lỗi ngay, không đợi (giúp tránh lỗi 500 của Vercel)
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
    // Kiểm tra nếu đã kết nối rồi thì không kết nối lại
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.DB_URL as string, {
            // Chỉ đợi tối đa 5 giây để tìm server DB
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB đã kết nối thành công");
    } catch (error: any) {
        console.error("LỖI KẾT NỐI DB CHI TIẾT:", error.message);
        // In ra mã lỗi để biết là sai pass (AuthFailed) hay sai địa chỉ
    }
};