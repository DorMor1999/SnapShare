import { Schema, model, Types } from 'mongoose';

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

export const Invitation = model('Invitation', invitationSchema);
