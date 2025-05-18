import * as photoUserDal from "../dal/photoUser.dal";
import { IPhotoUser } from "../models/photoUser.model";

/**
 * Get PhotoUser entries by userId
 * @param userId - The ID of the user
 * @returns A list of PhotoUser entries associated with the user
 */
export const getPhotoUserByUserId = async (userId: string): Promise<IPhotoUser|null> => {
  return await photoUserDal.getPhotoUserByUserId(userId);
};

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
    return await photoUserDal.updatePhotoUser(userId, updateData);
};