import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  profileImageIds: mongoose.Types.ObjectId[];
  hashedPassword: string;
  phoneNumber: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImageIds: [{ type: mongoose.Types.ObjectId, ref: "Image", required: false }],
    hashedPassword: { type: String, required: true },
    phoneNumber: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);