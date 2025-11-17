import mongoose, { Schema, Document } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {type: String, unique: true, sparse:true},
    email: {type: String, unique: true, sparse: true},
    address: {type: String, unique: true, sparse: true},
    refreshTokens: [{type: String}],
  },

  { timestamps: true }
  
);

export const User = mongoose.model("User", userSchema);
