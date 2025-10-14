import express from "express";
import route from "./routes/user.route";
import { connectDB } from "./config/db";


const app = express();
app.use(express.json());

// Kết nối MongoDB
connectDB();

app.use("/api/users", route);

export default app;
