import FormData from "form-data";
import { AxiosResponse } from "axios";
import { FaceRecognitionEncodeResponse } from "../models/api-responses/faceRecognitionEncode.response";
import getFaceRecognitionClient from "./clients/faceRecognition.client";

export const encodePhoto = async (files: Express.Multer.File[], userId: string): Promise<FaceRecognitionEncodeResponse | undefined> => {
  try {
    const formData = new FormData();
    // Append each file to the form data
    for (const file of files) {
      formData.append('files[]', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
    }

    let faceRecognitionClient = getFaceRecognitionClient()
    const response: AxiosResponse = await faceRecognitionClient.post(`/profiles/${userId}/encode`, formData, {
      headers: {
        "Content-Type": "image/jpeg",
        "SERVICE-SECRET-KEY": process.env.FACE_RECOGNITION_SERVICE_SECRET_KEY
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error communicating with face-recognition service:", error);
    throw new Error("Failed to communicate with face-recognition service");
  }
};