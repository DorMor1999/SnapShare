import * as eventDal from "../dal/event.dal";
import { IEvent } from "../models/event.model";
import { SortOrder } from "mongoose";
import { uploadEventFiles } from "./photo.service";

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