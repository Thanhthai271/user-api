import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  id: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
