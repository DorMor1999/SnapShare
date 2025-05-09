import { Invitation } from '../models/invitation.model';

export const createInvitation = (data: any) => Invitation.create(data);

export const getInvitations = () => Invitation.find();

export const getInvitationById = (id: string) => Invitation.findById(id);

export const updateInvitation = (id: string, data: any) =>
  Invitation.findByIdAndUpdate(id, data, { new: true });

export const deleteInvitation = (id: string) => Invitation.findByIdAndDelete(id);


export const findInvitation = async (filter: { email: string; eventId: string; status: string }) => {
  return Invitation.findOne(filter);  
};
