import axios, { AxiosInstance } from "axios";

let faceRecognitionClient: AxiosInstance | null = null;

const getFaceRecognitionClient = (): AxiosInstance => {
  if (!faceRecognitionClient) {
    faceRecognitionClient = axios.create({
      baseURL: process.env.FACE_RECOGNITION_SERVICE_URL || "http://localhost:5000", // Replace with the actual service URL
      timeout: 30000,
    });
  }
  return faceRecognitionClient;
};

export default getFaceRecognitionClient;