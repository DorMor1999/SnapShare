import mongoose  from "mongoose";
import * as photoDal from "../dal/photo.dal";
import { IPhoto } from "../models/photo.model";
import { getBlobContainerClient } from "./clients/photoStorage.client";
import { v4 as uuidv4 } from "uuid";

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
  userIds: string[]
): Promise<IPhoto | null> => {
  const objectIdUserIds = userIds.map((id) => new mongoose.Types.ObjectId(id));
  return await photoDal.updatePhotoUserIds(photoId, objectIdUserIds);
};