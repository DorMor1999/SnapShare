import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profilePhotosUrls: string[];
  profilePhotosEncoding: number[];
  hashedPassword: string;
  phoneNumber: string;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePhotosUrls: [{ type: [String], required: false }],
    profilePhotosEncoding: { type: [Schema.Types.Mixed], required: false },
    hashedPassword: { type: String, required: true },
    phoneNumber: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);