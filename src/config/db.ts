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
let isConnected = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("=> Sử dụng kết nối database có sẵn");
    return;
  }

  try {
    console.log("=> Đang tạo kết nối mới tới MongoDB...");
    
    // Đảm bảo DB_URL đã chính xác từ biến môi trường
    const db = await mongoose.connect(process.env.DB_URL as string, {
      dbName: "test", // Ghi rõ tên database là "test" như trong url của bạn
      serverSelectionTimeoutMS: 5000, // Timeout sau 5s nếu không thấy DB
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("=> MongoDB đã kết nối thành công!");
  } catch (error) {
    console.error("=> Lỗi kết nối MongoDB:", error);
    // Quan trọng: Ném lỗi để Server biết và dừng lại
    throw error;
  }
};