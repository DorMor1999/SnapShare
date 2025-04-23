import mongoose, { ObjectId } from "mongoose";
import { getBlobContainerClient } from "./clients/photoStorage.client";
import { v4 as uuidv4 } from "uuid";

export const uploadFileToBlobStorage = async (
  file: Express.Multer.File,
  containerName: string,
  blobFolderName: string = "",
  useUuid: boolean = false
): Promise<string> => {
  try {
    const containerClient = getBlobContainerClient(containerName);

    await containerClient.createIfNotExists();

    const fileName = useUuid ? `${uuidv4()}-${file.originalname}` : file.originalname;
    const blobName = `${blobFolderName}/${fileName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    return blockBlobClient.url;
  } catch (error) {
    console.error("Error uploading file to Azure Blob Storage:", error);
    throw new Error("Failed to upload file to Azure Blob Storage");
  }
};


// New method to upload multiple files
export const uploadMultipleFilesToBlobStorage = async (
    userId: mongoose.Types.ObjectId,
    files: Express.Multer.File[],
    containerName: string,
  ): Promise<string[]> => {
    try {
      // Upload each file and collect their URLs
      const uploadedUrls = await Promise.all(
        files.map(async (file, index) => {
          file.originalname = `${userId}-${index}`; 
          return await uploadFileToBlobStorage(file, containerName)
        })
      );
  
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading multiple files to Azure Blob Storage:", error);
      throw new Error("Failed to upload multiple files to Azure Blob Storage");
    }
  };

  // add method that uploads profile photos to blob and using uploadMultipleFilesToBlobStorage
export const uploadProfilePhotosToBlobStorage = async (
    userId: mongoose.Types.ObjectId,
    files: Express.Multer.File[],
    containerName: string,
  ): Promise<string[]> => {
    try {
      // Upload each file and collect their URLs
      const uploadedUrls = await Promise.all(
        files.map(async (file, index) => {
          file.originalname = `${userId}-profile-${index}`; 
          return await uploadFileToBlobStorage(file, containerName, "profiles")
        })
      );
  
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading multiple files to Azure Blob Storage:", error);
      throw new Error("Failed to upload multiple files to Azure Blob Storage");
    }
  };