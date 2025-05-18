import { Schema, model, Types, Document } from "mongoose";

export interface IPhotoUser extends Document {
  userId: Types.ObjectId;
  photoIds: Types.ObjectId[];
}

const photoUserSchema = new Schema<IPhotoUser>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    photoIds: [{ type: Types.ObjectId, ref: "Photo", required: true }],
  },
  { timestamps: true }
);

export const PhotoUser = model<IPhotoUser>("PhotoUser", photoUserSchema);