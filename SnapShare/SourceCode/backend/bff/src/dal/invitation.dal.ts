import { Invitation } from '../models/invitation.model';
import Event from '../models/event.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

export const createInvitation = (data: any) => Invitation.create(data);

export const getInvitations = () => Invitation.find();

export const getInvitationById = (id: string) => Invitation.findById(id);

export const updateInvitation = (id: string, data: any) =>
  Invitation.findByIdAndUpdate(id, data, { new: true });

export const deleteInvitation = (id: string) => Invitation.findByIdAndDelete(id);


export const findInvitation = async (filter: { email: string; eventId: string; status: string }) => {
  return Invitation.findOne(filter);  
};

export const findInvitationsByEvent = async (eventId: string, filterBy?: string) => {
  const query: any = { eventId };

  if (filterBy && ['ACCEPTED', 'PENDING', 'DECLINED'].includes(filterBy)) {
    query.status = filterBy;
  }

  return Invitation.find(query).populate('eventId');
};

export const findInvitationsByEmail = async (email: string, filterBy?: string) => {
  const query: any = { email: email.toLowerCase().trim() };

  if (filterBy && ['ACCEPTED', 'PENDING', 'DECLINED'].includes(filterBy)) {
    query.status = filterBy;
  }

  return Invitation.find(query).populate('eventId');
};


export const acceptInvitation = async (invitationId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await Invitation.findById(invitationId).session(session);
    if (!invitation) throw new Error('Invitation not found');
    if (invitation.status !== 'PENDING') throw new Error('Only pending invitations can be accepted');

    const user = await User.findOne({ email: invitation.email }).session(session);
    if (!user) throw new Error('User with this email not found');

    // Update invitation status
    invitation.status = 'ACCEPTED';
    await invitation.save({ session });

    // Add userId to appropriate array in Event
    const updateField =
      invitation.type === 'OWNER'
        ? { $addToSet: { owners: user._id } }
        : { $addToSet: { participants: user._id } };

    await Event.findByIdAndUpdate(invitation.eventId, updateField, { session });

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};