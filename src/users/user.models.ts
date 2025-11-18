import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";


const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, required: true},
    address: { type: String, unique: true, sparse: true },
    room: { type: String, required: true, unique: true },
    refreshTokens: [{ type: String }]
  },

  { timestamps: true }

);

export const User = mongoose.model("User", userSchema);
