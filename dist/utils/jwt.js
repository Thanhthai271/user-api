import jwt from "jsonwebtoken";
const SECRET = "MY_SECRET_KEY";
export const createToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: "15m" });
};
export const createRefreshToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: "7d" });
};
export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
//# sourceMappingURL=jwt.js.map