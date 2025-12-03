import mongoose, { Schema, Document } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, required: true },
    address: { type: String, sparse: true },
    room: { type: String, required: true }
  },

  { timestamps: true }

);

export const User = mongoose.model("User", userSchema);
