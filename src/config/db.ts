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

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error('Vui lòng kiểm tra lại biến DB_URL trong Environment Variables trên Vercel.');
}

/** * Sử dụng biến global để duy trì kết nối qua các lần gọi hàm (Serverless)
 * Tránh lỗi "Operation buffering timed out"
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 1. Nếu đã có kết nối, dùng lại luôn (không tạo mới)
  if (cached.conn) {
    return cached.conn;
  }

  // 2. Nếu chưa có kết nối, tạo một lời hứa (promise) kết nối
  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Cho phép đợi nếu db chưa sẵn sàng
      dbName: "test",       // Khớp với database "test" trên Atlas của bạn
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ Kết nối MongoDB thành công");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Lỗi kết nối MongoDB:", e);
    throw e;
  }

  return cached.conn;
};