import Event from '../models/event.model';
import { Types } from 'mongoose';
import { SortOrder } from 'mongoose';

export const findAll = () => {
  return Event.find().lean();
};

export const findById = (id: string) => {
  return Event.findById(id).lean();
};

export const create = (data: {
  name: string;
  date: Date;
  owners: Types.ObjectId[];
  participants: Types.ObjectId[];
  photoGroups: Types.ObjectId[];
}) => {
  return Event.create(data);
};

export const update = (
  id: string,
  updates: Partial<typeof Event.prototype>
) => {
  return Event.findByIdAndUpdate(id, updates, { new: true });
};

export const remove = (id: string) => {
  return Event.findByIdAndDelete(id);
};

export const findByUserIdSorted = async (
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
