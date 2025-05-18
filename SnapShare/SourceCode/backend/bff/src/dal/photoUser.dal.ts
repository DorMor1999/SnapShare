import { PhotoUser, IPhotoUser } from "../models/photoUser.model";

export const createPhotoUser = async (data: Partial<IPhotoUser>): Promise<IPhotoUser> => {
  const photoUser = new PhotoUser(data);
  return await photoUser.save();
};

export const getPhotoUserById = async (id: string): Promise<IPhotoUser | null> => {
  return await PhotoUser.findById(id).populate("userId").populate("photoIds").exec();
};

export const getPhotoUserByUserId = async (userId: string): Promise<IPhotoUser | null> => {
  return await PhotoUser.findOne({ userId }).populate("photoIds").exec();
};

export const updatePhotoUser = async (
  id: string,
  updateData: Partial<IPhotoUser>
): Promise<IPhotoUser | null> => {
  return await PhotoUser.findByIdAndUpdate(id, updateData, { new: true }).exec();
};

export const deletePhotoUser = async (id: string): Promise<boolean> => {
  const result = await PhotoUser.findByIdAndDelete(id).exec();
  return !!result;
};