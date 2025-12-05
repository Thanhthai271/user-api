
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: { type: String, unique: true },
    user: mongoose.Types.ObjectId,
    expiresAt: Date,
    createAt: Date,
},
    { timestamps: true }
)

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)
