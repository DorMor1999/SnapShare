import Event, { IEvent } from '../models/event.model';
import { Types } from 'mongoose';
import { SortOrder } from 'mongoose';

export const findAll = () => {
  return Event.find();
};

export const findById = (id: string) => {
  return Event.findById(id).populate('owners').populate('participants');
};

export const create = (data: Partial<IEvent>) => {
  return Event.create(data);
};

export const update = (
  id: string,
  updates: Partial<typeof Event.prototype>
) => {
  return Event.findByIdAndUpdate(id, updates, { new: true });
};

export const updateEventSetById = async (
  id: string,
  updateField: any,
  session: any
) => {
  await Event.findByIdAndUpdate(id, updateField, { session });
};

export const remove = (id: string) => {
  return Event.findByIdAndDelete(id);
};

export const findUserEventsByUserIdSorted = async (
  userId: string,
  sortBy: string,
  sortOrder: SortOrder
) => {
  const userObjectId = new Types.ObjectId(userId);

  const events = await Event.find({
    $or: [{ owners: userObjectId }, { participants: userObjectId }],
  })
    .lean<{ owners: Types.ObjectId[] }[]>() // 👈 just tell TypeScript that owners is ObjectId array
    .sort({ [sortBy]: sortOrder });

  return events.map((event) => ({
    ...event,
    isOwner: event.owners.some((ownerId) => ownerId.equals(userObjectId)),
  }));
};
