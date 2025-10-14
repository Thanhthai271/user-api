import jwt from "jsonwebtoken";
export declare const createToken: (payload: object) => string;
export declare const createRefreshToken: (payload: object) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
//# sourceMappingURL=jwt.d.ts.map