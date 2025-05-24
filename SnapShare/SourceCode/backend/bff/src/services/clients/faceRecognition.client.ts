import axios, { AxiosInstance } from "axios";

let faceRecognitionClient: AxiosInstance | null = null;
const maxTimeout = 2147483647;
const getFaceRecognitionClient = (): AxiosInstance => {
  if (!faceRecognitionClient) {
    faceRecognitionClient = axios.create({
      baseURL: process.env.FACE_RECOGNITION_SERVICE_URL || "http://localhost:5000", // Replace with the actual service URL
      timeout: maxTimeout,
    });
  }
  return faceRecognitionClient;
};

export default getFaceRecognitionClient;