import * as eventDal from "../dal/event.dal";
import { IEvent } from "../models/event.model";
import mongoose, { SortOrder } from "mongoose";
import { addUserIdsToPhoto, getPhotosByPhotoIds, uploadEventFiles } from "./photo.service";
import { recognizeFaces } from "../services/faceRecognition.service";
import { IPhoto } from "../models/photo.model";
import { getUsersByUserIds } from "./user.service";
import { IUser } from "../models/user.model";
import { FaceRecognitionRecognizeResponse } from "../models/api-responses/faceRecognitionRecognize.response";
import { createPhotoUser, getPhotoUserByUserId, updatePhotoUserById } from "./photoUser.service";
import { IPhotoUser, PhotoTag } from "../models/photoUser.model";

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
  let savedPhotos = await uploadEventFiles(photos, eventId);

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
  const userIds: string[] = Array.from(
    new Set([
      ...event.participants.map((participant) => participant._id.toString()),
      ...event.owners.map((owner) => owner._id.toString()),
    ])
  );  
  let users: IUser[] = await getUsersByUserIds(userIds);
  let recognition_res: FaceRecognitionRecognizeResponse = await recognizeFaces(eventId, photos, users);
  let photoUsersModel: IPhotoUser[] = [];
  let recognitions = recognition_res.recognition_results;

  for (const recognition of recognitions) {
    //let user = users.find(user => user._id.toString() === recognition.userId);
    let photoUserModel = await getPhotoUserByUserId(recognition.userId);
    if(!photoUserModel) {
      let photoTags: PhotoTag[] = recognition.photos.map(photo => {
        return {
          photoId: new mongoose.Types.ObjectId(photo.photo_id),
          position: photo.position,
        };
      }); 
      let photoUser: Partial<IPhotoUser> = {
        userId: new mongoose.Types.ObjectId(recognition.userId),
        photoTags
      };
      photoUserModel = await createPhotoUser(photoUser);
    } else {
      let newPhotoIds: string[] = [];
      let newPhotoTags: PhotoTag[] = recognition.photos.map(photo => {
        let id = new mongoose.Types.ObjectId(photo.photo_id)
        newPhotoIds.push(id.toString());
        return {
          photoId: id,
          position: photo.position,
        };
      });

      photoUserModel.photoTags.forEach((tag) => {
        if(!newPhotoIds.includes(tag.photoId.toString())){
          newPhotoTags.push(tag);
        }
      });

      photoUserModel.photoTags = newPhotoTags;
      
      photoUserModel = await updatePhotoUserById(photoUserModel.userId.toString(), photoUserModel);
    }

    if(photoUserModel){
      photoUsersModel.push(photoUserModel);
      for (const p of recognition.photos) {
        await addUserIdsToPhoto(p.photo_id, [recognition.userId]);
      }
    }
  };
  
  return photoUsersModel;
};