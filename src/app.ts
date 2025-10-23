import express from "express";
import route from "./routes/user.route";
import { connectDB } from "./config/db";
import cors from "cors";

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Cho phép domain frontend (VD: React)
  methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
  allowedHeaders: ["Content-Type", "Authorization"], // Header được phép
  credentials: true // Cho phép gửi cookie/token
}));

app.use(express.json());

// Kết nối MongoDB
connectDB();

app.use("/api/users", route);

export default app;
