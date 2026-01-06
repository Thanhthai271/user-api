import app from "./app"
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 5000 ;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

console.log("DB_URL check:", process.env.DB_URL ? "Đã nhận" : "Chưa nhận");
export default app;     