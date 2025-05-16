import * as PhotoGroupDAL from "../dal/photoGroup.dal";
import { IPhotoGroup } from "../models/photoGroup.model";

export const createPhotoGroup = async (data: Partial<IPhotoGroup>): Promise<IPhotoGroup> => {
  return await PhotoGroupDAL.createPhotoGroup(data);
};

export const getPhotoGroupById = async (id: string): Promise<IPhotoGroup | null> => {
  return await PhotoGroupDAL.getPhotoGroupById(id);
};

export const getPhotoGroupsByEventId = async (eventId: string): Promise<IPhotoGroup[]> => {
  return await PhotoGroupDAL.getPhotoGroupsByEventId(eventId);
};

export const updatePhotoGroup = async (
  id: string,
  updateData: Partial<IPhotoGroup>
): Promise<IPhotoGroup | null> => {
  return await PhotoGroupDAL.updatePhotoGroup(id, updateData);
};

export const deletePhotoGroup = async (id: string): Promise<boolean> => {
  return await PhotoGroupDAL.deletePhotoGroup(id);
};

export const getParticipantsIdsFromPhotoGroup = async (photoGroupId: string): Promise<string[]> => {
    return  await PhotoGroupDAL.getParticipantsIdsFromPhotoGroup(photoGroupId) || [];
};
