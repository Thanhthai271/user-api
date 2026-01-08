import express from "express";
import routes from "./routes";
import { connectDB } from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';

const app = express();

app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:5501",
    "http://localhost:5501"
  ], // Cho phép domain frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Các phương thức được phép
  allowedHeaders: ["Content-Type", "Authorization"], // Header được phép
  credentials: true // Cho phép gửi cookie/token
}));


app.use(cookieParser());
app.use(express.json());
app.use(async (req, res, next) => {
  try {
    await connectDB(); // Gọi kết nối ở đây
    next(); // Kết nối xong mới cho đi tiếp
  } catch (error) {
    console.error("Lỗi kết nối DB từ Middleware:", error);
    res.status(500).json({ message: "Lỗi kết nối cơ sở dữ liệu" });
  }
});
app.use("/api", routes);
connectDB();

app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Định nghĩa route gốc để trả về file login.html khi truy cập "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

export default app;
