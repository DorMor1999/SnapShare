import Event from '../models/event.model';
import { Types } from 'mongoose';
import { SortOrder } from 'mongoose'

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

export const findByUserIdSorted = (
  userId: string,
  sortBy: string,
  sortOrder: SortOrder
) => {
  return Event.find({
    $or: [{ owners: userId }, { participants: userId }],
  })
    .lean()
    .sort({ [sortBy]: sortOrder });
};
