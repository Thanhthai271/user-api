import dotenv from "dotenv"
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET!;
const SECRET_KEY_REFRESH = process.env.JWT_SECRET_REFRESH!;

// if (!SECRET_KEY || !SECRET_KEY_REFRESH) {
//     console.error("🚫 LỖI CẤU HÌNH: JWT_SECRET hoặc JWT_SECRET_REFRESH bị thiếu trong file .env!")
//     process.exit(1)
// }

export { SECRET_KEY, SECRET_KEY_REFRESH }

