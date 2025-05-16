import { PhotoGroup, IPhotoGroup } from "../models/photoGroup.model";

export const createPhotoGroup = async (data: Partial<IPhotoGroup>): Promise<IPhotoGroup> => {
  const photoGroup = new PhotoGroup(data);
  return await photoGroup.save();
};

export const getPhotoGroupById = async (id: string): Promise<IPhotoGroup | null> => {
  return await PhotoGroup.findById(id).populate("participants").exec();
};

export const getPhotoGroupsByEventId = async (eventId: string): Promise<IPhotoGroup[]> => {
  return await PhotoGroup.find({ eventId }).populate("participants").exec();
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

export const getParticipantsIdsFromPhotoGroup = async (id: string): Promise<string[] | null> => {
    const photoGroup = await PhotoGroup.findById(id).exec();
    return photoGroup ? photoGroup.participants.map(participant => participant.toString()) : null;
};