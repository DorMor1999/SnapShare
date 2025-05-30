import mongoose from "mongoose";
import * as photoUserDal from "../dal/photoUser.dal";
import { IPhoto, Photo } from "../models/photo.model";
import { IPhotoUser, PhotoTag } from "../models/photoUser.model";
import { IUser } from "../models/user.model";
import { getUsersByUserIds } from "./user.service";

/**
 * Get PhotoUser entries by userId
 * @param userId - The ID of the user
 * @returns A list of PhotoUser entries associated with the user
 */
export const getPhotoUserByUserId = async (userId: string): Promise<IPhotoUser|null> => {
  return await photoUserDal.getPhotoUserByUserId(userId);
};

export const getPhotoUsersByUserIds = async (userIds: string[]): Promise<IPhotoUser[]> => {
  if (!userIds || userIds.length === 0) {
    return [];
  }
  return await photoUserDal.getPhotoUsersByUserIds(userIds);
}



/**
 * Create a new PhotoUser entry
 * @param photoUserData - The data for the new PhotoUser
 * @returns The created PhotoUser entry
 */
export const createPhotoUser = async (photoUserData: Partial<IPhotoUser>): Promise<IPhotoUser> => {
    return await photoUserDal.createPhotoUser(photoUserData);
};

/**
 * Update a PhotoUser entry by ID
 * @param userId - The ID of the user
 * @param updateData - The data to update the PhotoUser entry with
 * @returns The updated PhotoUser entry
 */
export const updatePhotoUserById = async (userId: string, updateData: Partial<IPhotoUser>): Promise<IPhotoUser | null> => {
  let existingPhotoUser: IPhotoUser|null = await photoUserDal.getPhotoUserByUserId(userId);
  if (!existingPhotoUser) {
    throw new Error(`PhotoUser with userId ${userId} not found`);
  }
  return await photoUserDal.updatePhotoUser(existingPhotoUser._id!.toString(), updateData);
};

export const addPhotoTagToUser = async (userId: string, photoId: string, position: string, session?: any): Promise<IPhotoUser | null> => {
  let existingPhotoUser: IPhotoUser|null = await photoUserDal.getPhotoUserByUserId(userId);
  if (!existingPhotoUser) {
    throw new Error(`PhotoUser with userId ${userId} not found`);
  }
  let pid = new mongoose.Types.ObjectId(photoId); 
  let tag: PhotoTag = { photoId: pid, position };
  const updatedPhotoTags = [
    ...(existingPhotoUser.photoTags || []).filter(existingTag => existingTag.photoId.toString() !== photoId),
    tag
  ];
  return await photoUserDal.updatePhotoUser(existingPhotoUser._id!.toString(), { photoTags: updatedPhotoTags }, session);
}

export const removePhotoTagFromUser = async (userId: string, photoId: string, session?: any): Promise<IPhotoUser | null> => {
  let existingPhotoUser: IPhotoUser|null = await photoUserDal.getPhotoUserByUserId(userId);
  if (!existingPhotoUser) {
    throw new Error(`PhotoUser with userId ${userId} not found`);
  }
  const updatedPhotoTags = existingPhotoUser.photoTags?.filter(tag => tag.photoId.toString() !== photoId) || [];
  return await photoUserDal.updatePhotoUser(existingPhotoUser._id!.toString(), { photoTags: updatedPhotoTags }, session);
}

export const getUsersAndPhotosByUserIds = async (userIds: string[]): Promise<{ users: IUser[], photos: IPhoto[] }> => {
  const photoUsers = await photoUserDal.getPhotoUsersByUserIds(userIds);

  if (!photoUsers || photoUsers.length === 0) {
    return { users: [], photos: [] };
  }

  const populatedUsers = await getUsersByUserIds(userIds);

  const uniquePhotoIds = new Set<string>();
  photoUsers.forEach(user => {
    user?.photoTags?.forEach(tag => {
      uniquePhotoIds.add(tag.photoId.toString());
    });
  });

  const photos = await Photo.find({ _id: { $in: Array.from(uniquePhotoIds) } });

  return { users: populatedUsers, photos: photos };
};