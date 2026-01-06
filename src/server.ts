import app from "./app"
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
export default app;