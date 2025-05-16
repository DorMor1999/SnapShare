import { Schema, model, Types, Document } from "mongoose";

export interface IPhotoGroup extends Document {
  eventId: Types.ObjectId;
  name: string;
  description: string;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const photoGroupSchema = new Schema<IPhotoGroup>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    participants: [{ type: Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const PhotoGroup = model<IPhotoGroup>("PhotoGroup", photoGroupSchema);