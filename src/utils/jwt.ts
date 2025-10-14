import jwt from "jsonwebtoken";

const SECRET = "MY_SECRET_KEY";

export const createToken = (payload : object) => {
    return jwt.sign(payload, SECRET, {expiresIn : "15m"});
};

export const createRefreshToken = (payload : object) => {
    return jwt.sign(payload, SECRET, {expiresIn : "7d"});
};

export const verifyToken = (token : string) => {
        return jwt.verify(token, SECRET);
};
