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
