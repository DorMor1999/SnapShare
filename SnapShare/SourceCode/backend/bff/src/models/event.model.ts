import mongoose, { Schema, model, Types } from "mongoose";

export interface IEvent extends Document {
  name: string;
  date: Date;
  owners: Types.ObjectId[];
  participants: Types.ObjectId[];
  photoGroups: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    owners: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    participants: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    photoGroups: [
      {
        type: Types.ObjectId,
        ref: "PhotoGroup",
        required: true,
      },
    ],
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
