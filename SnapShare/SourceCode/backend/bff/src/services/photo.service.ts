import mongoose  from "mongoose";
import * as photoDal from "../dal/photo.dal";
import { IPhoto } from "../models/photo.model";
import { getBlobContainerClient } from "./clients/photoStorage.client";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { getPhotoUserByUserId } from "./photoUser.service";

export const uploadEventFiles = async (
  files: Express.Multer.File[], eventId: string): Promise<Partial<IPhoto>[]> => {
  try {
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || '';
    const containerClient = getBlobContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists();

    let photos: Partial<IPhoto>[] = [];
    // Upload each file and collect their URLs
    const uploadedUrls = await Promise.all(      
      files.map(async (file) => {
        let photo: Partial<IPhoto> = {
          _id: new mongoose.Types.ObjectId(),
          eventId: eventId,
          url: '',
        };
        const blobName = `events/${eventId}/${photo._id}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
        });
        
        photo.url = blockBlobClient.url;
        photos.push(photo);
        
        return blockBlobClient.url;
      })
    );
    const savedPhotos = photoDal.saveBulkPhotos(photos);

    return savedPhotos;
  } catch (error) {
    console.error("Error uploading files to Azure Blob Storage:", error);
    throw new Error("Failed to upload files to Azure Blob Storage");
  }
};

export const getPhotosByEventId = async (eventId: string): Promise<IPhoto[]> => {
  try {
    const photos = await photoDal.getPhotosByEventId(eventId);
    return photos;
  } catch (error) {
    console.error("Error retrieving photos by event ID:", error);
    throw new Error("Failed to retrieve photos by event ID");
  }
};

export const getPhotosByPhotoIds = async (photoIds: string[]): Promise<IPhoto[]> => {
  try {
    const photos = await photoDal.getPhotosByIds(photoIds);
    return photos;
  } catch (error) {
    console.error("Error retrieving photos by event ID:", error);
    throw new Error("Failed to retrieve photos by event ID");
  }
};

export const addUserIdsToPhoto = async (
  photoId: string,
  userIds: string[],
  session?: any
): Promise<IPhoto | null> => {
  const objectIdUserIds = userIds.map((id) => new mongoose.Types.ObjectId(id));
  return await photoDal.updatePhotoUserIds(photoId, objectIdUserIds, session);
};

export const getUserPhotosByEventId = async (
  eventId: string,  
  userId: string
): Promise<IPhoto[]> => { 
  try {
    const photos = await photoDal.getPhotosWithUserPositionsInEvent(eventId, userId);
    return photos;
  } catch (error) {
    console.error("Error retrieving user photos by event ID:", error);
    throw new Error("Failed to retrieve user photos by event ID");
  }
}

export const getPhotoWithUsers = async (photoId: string) => {
  if (!Types.ObjectId.isValid(photoId)) {
    throw new Error("Invalid photo ID");
  }

  const photo = await photoDal.getPhotoByIdWithUsers(photoId);
  if (!photo) {
    throw new Error("Photo not found");
  }

  return photo;
};

export const fetchPhotoById = async (photoId: string): Promise<IPhoto> => {
  try {
    const photo = await photoDal.getPhotoById(photoId);
    return photo;
  } catch (error) {
    console.error("Service error fetching photo by ID:", error);
    throw new Error("Could not fetch photo");
  }
};

export const removeUserFromUserIds = async (photoId: string, userId: string, session?: any): Promise<IPhoto | null> => {
  if (!Types.ObjectId.isValid(photoId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid photo or user ID");
  }

  const user = await getPhotoUserByUserId(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await photoDal.removePhotoUserIds(photoId, [new Types.ObjectId(userId)], session);
}
