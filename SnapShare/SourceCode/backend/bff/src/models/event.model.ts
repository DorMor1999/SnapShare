import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema(
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

const Event = model("Event", eventSchema);

export default Event;
