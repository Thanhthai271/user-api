import express from "express";
import routes from "./routes";
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

app.use((req, res, next) => {
  console.log("Request:", req.method, req.originalUrl);
  next();
});

// Kết nối MongoDB
connectDB();

app.use("/api", routes);

export default app;
