import * as eventDal from "../dal/event.dal";
import { IEvent } from "../models/event.model";
import mongoose, { SortOrder } from "mongoose";
import { addUserIdsToPhoto, fetchPhotoById, getPhotosByPhotoIds, removeUserFromUserIds, uploadEventFiles } from "./photo.service";
import { recognizeFaces } from "../services/faceRecognition.service";
import { IPhoto } from "../models/photo.model";
import { getUsersByUserIds } from "./user.service";
import { IUser } from "../models/user.model";
import { FaceRecognitionRecognizeResponse } from "../models/api-responses/faceRecognitionRecognize.response";
import { addPhotoTagToUser, createPhotoUser, getPhotoUserByUserId, removePhotoTagFromUser, updatePhotoUserById } from "./photoUser.service";
import { IPhotoUser, PhotoTag } from "../models/photoUser.model";
import { executeTransaction } from "../dal/transaction.manager.dal";

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

  return await eventDal.update(eventId, {});
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


export async function fetchUsersNotInPhoto(eventId: string, photoId: string) {
  const photo = await fetchPhotoById(photoId);
  if (!photo) throw new Error("Photo not found");

  const excludedUserIds = photo.userIds.map((id) => id.toString());

  return await eventDal.getEventUsersExcludingList(eventId, excludedUserIds);
}

export async function addUserTag(photoId: string, userId: string, position: string) {
    let res = await executeTransaction(async (session) => {
        return await addPhotoUserIdsAndPhotoUserTagSession(session, photoId, userId, position);
    });

    if(!res) {
        throw new Error("Failed to add user tag to photo");
    }
}

const addPhotoUserIdsAndPhotoUserTagSession = async (session: any, photoId: string, userId: string, position: string): Promise<boolean> => {
    let result = true;

    let photoRes = await addUserIdsToPhoto(photoId, [userId], session);
    let photoUserRes = await addPhotoTagToUser(userId, photoId, position, session);
    if(!photoRes || !photoUserRes) {
        result = false;
        throw new Error("Failed to add user tag to photo");
    }

    return result;
};

export async function removeUserTag(photoId: string, userId: string){
  let res = await executeTransaction(async (session) => {
    return await removePhotoUserIdsAndPhotoUserTagSession(session, photoId, userId);
  });

  if(!res) {
      throw new Error("Failed to remove user tag to photo");
  }
}

const removePhotoUserIdsAndPhotoUserTagSession = async (session: any, photoId: string, userId: string): Promise<boolean> => {
  let result = true;

  let photoRes = await removeUserFromUserIds(photoId, userId, session);
  let photoUserRes = await removePhotoTagFromUser(userId, photoId, session);
  if(!photoRes || !photoUserRes) {
      result = false;
      throw new Error("Failed to remove user tag to photo");
  }

  return result;
};
