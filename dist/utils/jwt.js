"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY_REFRESH = exports.SECRET_KEY = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET;
exports.SECRET_KEY = SECRET_KEY;
const SECRET_KEY_REFRESH = process.env.JWT_SECRET_REFRESH;
exports.SECRET_KEY_REFRESH = SECRET_KEY_REFRESH;
//# sourceMappingURL=jwt.js.map