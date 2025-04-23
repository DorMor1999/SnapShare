import { BlobServiceClient } from "@azure/storage-blob";

let blobServiceClient: BlobServiceClient | null = null;

const getBlobServiceClient = (): BlobServiceClient => {
  if (!blobServiceClient) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set in the environment variables.");
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
};

export const getBlobContainerClient = (containerName: string) => {
  const client = getBlobServiceClient();
  return client.getContainerClient(containerName);
};