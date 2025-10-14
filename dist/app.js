import express from "express";
import route from "./routes/user.route";
import { connectDB } from "./config/db";
const app = express();
app.use(express.json());
// Kết nối MongoDB
connectDB();
// Routes
app.use("./user-api/routes.", route);
export default app;
//# sourceMappingURL=app.js.map