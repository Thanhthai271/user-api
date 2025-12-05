import dotenv from "dotenv"

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;
const SECRET_KEY_REFRESH = process.env.JWT_SECRET_REFRESH;

export {SECRET_KEY, SECRET_KEY_REFRESH}

