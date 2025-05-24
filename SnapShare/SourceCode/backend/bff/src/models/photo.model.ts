import { Schema, model, Types, Document } from "mongoose";

export interface IPhoto extends Document {
  eventId: string;
  photoGroups: string[];
  url: string;
  uploadedAt: Date;
  userIds: Types.ObjectId[];
}

const photoSchema = new Schema<IPhoto>(
  {
    eventId: String,
    url: { type: String, required: true },
    photoGroups: [{type: Types.ObjectId, ref: "PhotoGroup", required: true}],
    uploadedAt: { type: Date, default: Date.now },
    userIds: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Photo = model<IPhoto>("Photo", photoSchema);