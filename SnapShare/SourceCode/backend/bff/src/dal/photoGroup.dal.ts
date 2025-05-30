import { PhotoGroup, IPhotoGroup } from "../models/photoGroup.model";

export const createPhotoGroup = async (data: Partial<IPhotoGroup>): Promise<IPhotoGroup> => {
  if(!data.eventId || !data.name) {
    throw new Error("eventId and name are required to create a photo group.");
  }

  let existingGroup = await getPhotoGroupByEventIdAndName(data.eventId.toString(), data.name);
  if (existingGroup) {
    throw new Error(`Photo group with name "${data.name}" already exists for eventId "${data.eventId}".`);
  }

  const photoGroup = new PhotoGroup(data);
  return await photoGroup.save();
};

export const getPhotoGroupById = async (id: string): Promise<IPhotoGroup | null> => {
  return await PhotoGroup.findById(id).populate("userIds").exec();
};

export const getPhotoGroupsByEventId = async (eventId: string): Promise<IPhotoGroup[]> => {
  return await PhotoGroup.find({ eventId }).exec();
};

export const updatePhotoGroup = async (
  id: string,
  updateData: Partial<IPhotoGroup>
): Promise<IPhotoGroup | null> => {
  return await PhotoGroup.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

export const deletePhotoGroup = async (id: string): Promise<boolean> => {
  const result = await PhotoGroup.findByIdAndDelete(id).exec();
  return !!result;
};

export const getUserIdsFromPhotoGroup = async (id: string): Promise<string[] | null> => {
    const photoGroup = await PhotoGroup.findById(id).exec();
    return photoGroup ? photoGroup.userIds.map(userId => userId.toString()) : null;
};

export const getPhotoGroupByEventIdAndName = async (
  eventId: string,
  name: string
): Promise<IPhotoGroup | null> => {
  return await PhotoGroup.findOne({ eventId, name }).populate("userIds").exec();
};

export const updateGroupByEventIdAndName = async (
  eventId: string,
  name: string,
  updateData: Partial<IPhotoGroup>
): Promise<IPhotoGroup | null> => {
  return await PhotoGroup.findOneAndUpdate(
    { eventId, name },
    updateData, 
    { new: true }
  ).exec();
}

export const deleteGroupByEventIdAndName = async (
  eventId: string,
  name: string
): Promise<boolean> => {
  const result = await PhotoGroup.findOneAndDelete({ eventId, name }).exec();
  return !!result;
}
