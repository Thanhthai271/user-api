import express from "express";
import routes from "./routes";
import { connectDB } from "./config/db";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Cho phép domain frontend (VD: React)
  methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
  allowedHeaders: ["Content-Type", "Authorization"], // Header được phép
  credentials: true // Cho phép gửi cookie/token
}));


app.use(cookieParser());

// app.use((req, res, next) => {
//   let body = '';
//   req.on('data', chunk => {
//     body += chunk.toString();
//   });
//   req.on('end', () => {
//     console.log('--- RAW REQUEST START ---');
//     console.log('method:', req.method);
//     console.log('url:', req.originalUrl);
//     console.log('content-type:', req.headers['content-type']);
//     console.log('raw-length:', body.length);
//     // show raw but an escaped form so invisible chars thấy được
//     console.log('raw-escaped:', JSON.stringify(body));
//     console.log('--- RAW REQUEST END ---');
//     next();
//   });
// });
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request:", req.method, req.originalUrl);
  next();
});
app.use("/api", routes);
connectDB();

export default app;
