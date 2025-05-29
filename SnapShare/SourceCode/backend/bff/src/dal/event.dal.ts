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

export async function getEventUsersExcludingList(
  eventId: string,
  excludedUserIds: string[]
) {
  // Convert array to Set for efficient exclusion checks
  const excludedUserIdsSet = new Set(
    excludedUserIds.map((id) => id.toString())
  );

  // Find event and populate owners and participants
  const event = await Event.findById(eventId)
    .populate('owners')
    .populate('participants');

  if (!event) {
    throw new Error('Event not found');
  }

  // Filter owners and participants excluding users in excludedUserIdsSet
  const filteredOwners = (event.owners as any[]).filter(
    (owner) => !excludedUserIdsSet.has(owner._id.toString())
  );

  const filteredParticipants = (event.participants as any[]).filter(
    (participant) => !excludedUserIdsSet.has(participant._id.toString())
  );

  // Combine and return the filtered users
  return [...filteredOwners, ...filteredParticipants];
}
