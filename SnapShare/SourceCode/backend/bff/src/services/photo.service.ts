import { saveBulkPhotos } from "../dal/photo.dal";
import { IPhoto } from "../models/photo.model";
import { getBlobContainerClient } from "./clients/photoStorage.client";
import { v4 as uuidv4 } from "uuid";

export const uploadEventFiles = async (
  files: Express.Multer.File[], eventId: string): Promise<IPhoto[]> => {
  try {
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || '';
    const containerClient = getBlobContainerClient(containerName);

    // Ensure the container exists
    await containerClient.createIfNotExists();

    // Upload each file and collect their URLs
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const blobName = `events/${eventId}/${uuidv4()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
        });

        return blockBlobClient.url;
      })
    );

    const savedPhotos = saveBulkPhotos(eventId, uploadedUrls);

    return savedPhotos;
  } catch (error) {
    console.error("Error uploading files to Azure Blob Storage:", error);
    throw new Error("Failed to upload files to Azure Blob Storage");
  }
};

export const getPhotosByEventId = async (eventId: string): Promise<IPhoto[]> => {
  try {
    const photos = await getPhotosByEventId(eventId);
    return photos;
  } catch (error) {
    console.error("Error retrieving photos by event ID:", error);
    throw new Error("Failed to retrieve photos by event ID");
  }
};