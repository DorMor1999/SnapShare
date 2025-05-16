import { Invitation, IInvitation } from '../models/invitation.model';

import { FilterQuery } from 'mongoose';

export const createInvitation = async (data: Partial<IInvitation>, session: any): Promise<IInvitation> => {
  const invitation = new Invitation(data);
  return await invitation.save({ session });
};

export const getInvitations = async (): Promise<IInvitation[]> => {
  return await Invitation.find();
};

export const getInvitationById = async (id: string): Promise<IInvitation | null> => {
  return await Invitation.findById(id);
};

export const updateInvitation = async (id: string, updateData: Partial<IInvitation>): Promise<IInvitation | null> => {
  return await Invitation.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteInvitation = async (id: string): Promise<boolean> => {
  const result = await Invitation.findByIdAndDelete(id);
  return !!result;
};

export const findInvitation = async (query: Partial<IInvitation>): Promise<IInvitation | null> => {
  return await Invitation.findOne(query as FilterQuery<IInvitation>);
};

export const findInvitationsByEvent = async (eventId: string, filterBy?: string): Promise<IInvitation[]> => {
  const query: any = { eventId };
  if (filterBy) query.status = filterBy;
  return await Invitation.find(query);
};

export const findInvitationsByEmail = async (email: string, filterBy?: string): Promise<IInvitation[]> => {
  const query: any = { email };
  if (filterBy) query.status = filterBy;
  return await Invitation.find(query);
};

export const acceptInvitation = async (id: string, session: any): Promise<IInvitation | null> => {
  return await Invitation.findByIdAndUpdate(id, { status: "ACCEPTED" }, { new: true, session }) as IInvitation | null;
};

export const createManyInvitations = async (data: Partial<IInvitation>[], session: any): Promise<Partial<IInvitation>[]> => {
  return await Invitation.insertMany(data, { session });
};