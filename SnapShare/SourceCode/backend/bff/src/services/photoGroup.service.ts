import { Types } from "mongoose";
import * as PhotoGroupDAL from "../dal/photoGroup.dal";
import { IPhotoGroup } from "../models/photoGroup.model";
import * as PhotoUserService from "../services/photoUser.service";

export const createPhotoGroup = async (data: Partial<IPhotoGroup>): Promise<IPhotoGroup> => {
  if(data.userIds && data.userIds.length === 0) {
    throw new Error("userIds cannot be empty when creating a photo group.");
  }else if(data.userIds && data.userIds.length > 0) {
    data.userIds = uniquUserIds(data.userIds);
  } 

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
  eventId: string,
  updateData: Partial<IPhotoGroup>
): Promise<IPhotoGroup | null> => {
  let existingGroup = await PhotoGroupDAL.getPhotoGroupByEventIdAndName(eventId, updateData.name!);
  if (existingGroup && existingGroup.id.toString() !== id) {
    throw new Error(`Photo group with name "${updateData.name}" already exists for eventId "${updateData.eventId}".`);
  }
  updateData.userIds = uniquUserIds(updateData.userIds! || []); // Ensure userIds are unique
  return await PhotoGroupDAL.updatePhotoGroup(id, updateData);
};

export const deletePhotoGroup = async (id: string): Promise<boolean> => {
  return await PhotoGroupDAL.deletePhotoGroup(id);
};

export const getParticipantsIdsFromPhotoGroup = async (photoGroupId: string): Promise<string[]> => {
    return  await PhotoGroupDAL.getUserIdsFromPhotoGroup(photoGroupId) || [];
};

export const getPhotoGroupByEventIdAndName = async (eventId: string, name: string): Promise<IPhotoGroup | null> => {
  return await PhotoGroupDAL.getPhotoGroupByEventIdAndName(eventId, name);
};

export const updateGroupByEventIdAndName = async (
  eventId: string,
  name: string,
  updateData: Partial<IPhotoGroup>
): Promise<IPhotoGroup | null> => {
  return await PhotoGroupDAL.updateGroupByEventIdAndName(eventId, name, updateData);
};

export const deletePhotoGroupByEventIdAndName = async (
  eventId: string,
  name: string
): Promise<boolean> => {
  const photoGroup = await PhotoGroupDAL.getPhotoGroupByEventIdAndName(eventId, name);
  if (!photoGroup) {
    throw new Error(`Photo group with name "${name}" for eventId "${eventId}" does not exist.`);
  }
  return await PhotoGroupDAL.deletePhotoGroup(photoGroup.id.toString());
}


const uniquUserIds = (userIds: Types.ObjectId[]): Types.ObjectId[] => {
  return [...new Set(userIds)];
}

export const getEventPhotoGroups = async (eventId: string): Promise<any[]> => {
  const photoGroups = await PhotoGroupDAL.getPhotoGroupsByEventId(eventId);

  const result = await Promise.all(
    photoGroups.map(async (photoGroup) => {
      const userIds = photoGroup.userIds.map((id) => id.toString());
      const usersAndPhotos = await PhotoUserService.getUsersAndPhotosByUserIds(userIds);
      return {
        photoGroup,
        users: usersAndPhotos.users,
        photos: usersAndPhotos.photos,
      };
    })
  );

  return result;
};