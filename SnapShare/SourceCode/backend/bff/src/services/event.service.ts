import * as eventDal from "../dal/event.dal";
import { IEvent } from "../models/event.model";
import mongoose, { SortOrder } from "mongoose";
import { getPhotosByPhotoIds, uploadEventFiles } from "./photo.service";
import { recognizeFaces } from "../services/faceRecognition.service";
import { IPhoto } from "../models/photo.model";
import { getUsersByUserIds } from "./user.service";
import { IUser } from "../models/user.model";
import { FaceRecognitionRecognizeResponse } from "../models/api-responses/faceRecognitionRecognize.response";
import { createPhotoUser, getPhotoUserByUserId, updatePhotoUserById } from "./photoUser.service";
import { IPhotoUser } from "../models/photoUser.model";

export const getAllEvents = async (): Promise<IEvent[]> => {
  return await eventDal.findAll();
};

export const createEvent = async (eventData: Partial<IEvent>): Promise<IEvent> => {
  return await eventDal.create(eventData);
};

export const getEventById = async (eventId: string): Promise<IEvent | null> => {
  return await eventDal.findById(eventId);
};

export const updateEventById = async (eventId: string, updateData: Partial<IEvent>): Promise<IEvent | null> => {
  return await eventDal.update(eventId, updateData);
};

export const deleteEventById = async (eventId: string): Promise<any> => {
  return await eventDal.remove(eventId);
};

export const getUserEvents = async (
  userId: string,
  sortBy: string,
  sortOrder: SortOrder
): Promise<Partial<IEvent>[]> => {
  return await eventDal.findUserEventsByUserIdSorted(userId, sortBy, sortOrder);
};

export const uploadEventPhotos = async (eventId: string, photos: Express.Multer.File[]): Promise<IEvent | null> => {
  const event = await eventDal.findById(eventId);

  if (!event) {
    return null;
  }

  event.updatedAt = new Date(); 
  uploadEventFiles(photos, eventId);

  return await eventDal.update(eventId, { photoGroups: event.photoGroups });
};


export const recognizeEventPhotos = async (
  eventId: string,
  photoIds: string[]
): Promise<any> => {
  let event: IEvent | null = await eventDal.findById(eventId);
  if(!event) {
    throw new Error("Event not found");
  }
  
  let photos: IPhoto[] = await getPhotosByPhotoIds(photoIds);
  const userIds: string[] = Array.from(new Set([...event.participants.map(String), ...event.owners.map(String)]));
  let users: IUser[] = await getUsersByUserIds(userIds);
  let recognitions: FaceRecognitionRecognizeResponse[] = await recognizeFaces(eventId, photos, users);
  let photoUsersModel: IPhotoUser | null = null;
  
  recognitions.forEach(async (recognition) => {
    const user = users.find(user => user._id.toString() === recognition.userId);
    photoUsersModel = await getPhotoUserByUserId(recognition.userId);
    if(!photoUsersModel) {
      let photoUser: Partial<IPhotoUser> = {
        userId: new mongoose.Types.ObjectId(recognition.userId), 
        photoIds: recognition.photos.map(photo => new mongoose.Types.ObjectId(photo.photoId)) 
      };
      photoUsersModel = await createPhotoUser(photoUser);
    } else {
      const newPhotoIds = recognition.photos.map(photo => new mongoose.Types.ObjectId(photo.photoId));
      photoUsersModel.photoIds = Array.from(new Set([...photoUsersModel.photoIds, ...recognition.photos.map(photo => new mongoose.Types.ObjectId(photo.photoId))]));
      photoUsersModel = await updatePhotoUserById(photoUsersModel.userId.toString(), photoUsersModel);
    }
  });
  
  return photoUsersModel;
};