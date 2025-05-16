import mongoose, { Schema, model, Types, Document } from "mongoose";

export interface IInvitation extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  type: 'OWNER' | 'PARTICIPANT';
  status: 'ACCEPTED' | 'PENDING' | 'DECLINED';
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['OWNER', 'PARTICIPANT'],
      required: true,
    },
    status: {
      type: String,
      enum: ['ACCEPTED', 'PENDING', 'DECLINED'],
      default: 'PENDING',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Invitation = model<IInvitation>("Invitation", invitationSchema);