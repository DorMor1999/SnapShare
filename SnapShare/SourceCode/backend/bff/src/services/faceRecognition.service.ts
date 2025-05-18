import FormData from "form-data";
import { AxiosResponse } from "axios";
import { FaceRecognitionEncodeResponse } from "../models/api-responses/faceRecognitionEncode.response";
import getFaceRecognitionClient from "./clients/faceRecognition.client";
import { FaceRecognitionRecognizeRequest } from "../models/api-requests/faceRecognitionRecognize.request";
import { IPhoto } from "../models/photo.model";
import { IUser } from "../models/user.model";
import { FaceRecognitionRecognizeResponse } from "../models/api-responses/faceRecognitionRecognize.response";

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

export const recognizeFaces = async (
  eventId: string,
  photos: IPhoto[],
  users: IUser[]
): Promise<FaceRecognitionRecognizeResponse[]> => {
  const req: FaceRecognitionRecognizeRequest = {
    'event_photos_keys': photos.map((photo) => ({ photoId: photo.id, photoUrl: photo.url })),
    'users_encodes': users.map((user) => ({ userId: user._id.toString(), encoding: user.profilePhotosEncoding })),
  };

  const faceRecognitionClient = getFaceRecognitionClient();
  const response = await faceRecognitionClient.post(`/events/${eventId}/recognize`, req, {
    headers: {
      "Content-Type": "application/json",
      "SERVICE-SECRET-KEY": process.env.FACE_RECOGNITION_SERVICE_SECRET_KEY
    },
  });
  return response.data;
};