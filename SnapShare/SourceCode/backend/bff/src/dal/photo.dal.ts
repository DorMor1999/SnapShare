import { Photo, IPhoto } from "../models/photo.model";

export const savePhoto = async (eventId: string, url: string): Promise<IPhoto> => {
  try {
    const photo = new Photo({ eventId, url });
    return await photo.save();
  } catch (error) {
    console.error("Error saving photo to the database:", error);
    throw new Error("Failed to save photo to the database");
  }
};

export const saveBulkPhotos = async (
  eventId: string,
  urls: string[]
): Promise<IPhoto[]> => {
  try {
    const photos = urls.map((url) => ({ eventId, url }));
    return await Photo.insertMany(photos);
  } catch (error) {
    console.error("Error saving bulk photos to the database:", error);
    throw new Error("Failed to save bulk photos to the database");
  }
};

export const getPhotosByEventId = async (eventId: string): Promise<IPhoto[]> => {
  try {
    return await Photo.find({ eventId });
  } catch (error) {
    console.error("Error retrieving photos by eventId:", error);
    throw new Error("Failed to retrieve photos by eventId");
  }
};

export const getPhotosByIds = async (photoIds: string[]): Promise<IPhoto[]> => {
  try {
    return await Photo.find({ _id: { $in: photoIds } });
  } catch (error) {
    console.error("Error retrieving photos by IDs:", error);
    throw new Error("Failed to retrieve photos by IDs");
  }
};