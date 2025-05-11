import mongoose, { Schema, model, Types } from 'mongoose';

export interface IInvitation extends Document {
  eventId: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  type: 'OWNER' | 'PARTICIPANT';
  status: 'ACCEPTED' | 'PENDING' | 'DECLINED';
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema(
  {
    eventId: { type: Types.ObjectId, ref: 'Event', required: true },
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

const Invitation = mongoose.model<IInvitation>("Invitation", invitationSchema);

export default Invitation;