import { Schema, model, Types, Document } from "mongoose";

export type PhotoTag = {
  photoId: Types.ObjectId;
  position: string;
};

export interface IPhotoUser extends Document {
  userId: Types.ObjectId;
  photoTags: PhotoTag[];
}

const photoUserSchema = new Schema<IPhotoUser>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    photoTags: [ { type: Object, required: true } ],
  },
  { timestamps: true }
);

export const PhotoUser = model<IPhotoUser>("PhotoUser", photoUserSchema);