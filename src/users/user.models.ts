import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const userSchema = new Schema<IUser>(

  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {type: String, unique: true, sparse:true},
    email: {type: String, unique: true, sparse: true},
    address: {type: String, unique: true, sparse: true}
  },

  { timestamps: true }
  
);

export default mongoose.model<IUser>("User", userSchema);
