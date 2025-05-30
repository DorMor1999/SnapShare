import { Request, Response, RequestHandler } from 'express';
import { getUserById } from '../services/user.service';
import * as EventService from '../services/event.service';
import * as PhotoGroupService from '../services/photoGroup.service';
import {
  getPhotosByEventId,
  getUserPhotosByEventId,
  getPhotoWithUsers,
} from '../services/photo.service';
import { IPhotoGroup } from '../models/photoGroup.model';
import mongoose from 'mongoose';

export const getAllEvents: RequestHandler = async (req, res) => {
  try {
    const events = await EventService.getAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err });
  }
};

export const createEvent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, date, ownerId } = req.body;

    const user = await getUserById(ownerId);
    if (!user) {
      res.status(400).json({
        message: 'User not exist',
      });
      return;
    }

    const newEvent = await EventService.createEvent({
      name,
      date,
      owners: [ownerId],
      participants: [],
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err });
  }
};

export const getEventById: RequestHandler = async (req, res) => {
  try {
    const event = await EventService.getEventById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err });
  }
};

export const updateEventById: RequestHandler = async (req, res) => {
  try {
    const updatedEvent = await EventService.updateEventById(
      req.params.id,
      req.body
    );
    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err });
  }
};

export const deleteEventById: RequestHandler = async (req, res) => {
  try {
    const deleted = await EventService.deleteEventById(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err });
  }
};

export const getUserEvents: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const { sortBy = 'date', orderBy = 'asc' } = req.query;

  const validSortFields = ['date', 'name'];
  if (!validSortFields.includes(sortBy as string)) {
    res.status(400).json({ message: 'Invalid sort field.' });
    return;
  }

  const sortOrder = orderBy === 'desc' ? -1 : 1;

  try {
    const events = await EventService.getUserEvents(
      userId,
      sortBy as string,
      sortOrder
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user events', error });
  }
};

export const uploadEventPhotos: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({ message: 'No files uploaded.' });
    return;
  }

  try {
    const updatedEvent = await EventService.uploadEventPhotos(eventId, files);

    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found.' });
      return;
    }

    res.status(200).json({
      message: 'Photos uploaded successfully.',
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload photos.', error });
  }
};

export const recognizeEventPhotos: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  let { photoIds } = req.body as { photoIds: string[] | undefined };

  try {
    if (!photoIds || photoIds.length === 0) {
      let photos = await getPhotosByEventId(eventId);
      photoIds = photos.map((photo) => photo._id!.toString());
    }
    const recognitionResults = await EventService.recognizeEventPhotos(
      eventId,
      photoIds
    );

    if (!recognitionResults) {
      res.status(404).json({ message: 'Event or photos not found.' });
      return;
    }

    res.status(200).json({
      message: 'Photo recognition completed successfully.',
      results: recognitionResults,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to recognize photos.', error });
  }
};

export const getEventPhotos: RequestHandler = async (req, res) => {
  const { eventId } = req.params;

  try {
    const photos = await getPhotosByEventId(eventId);

    if (!photos || photos.length === 0) {
      res.status(404).json({ message: 'No photos found for this event.' });
      return;
    }

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event photos.', error });
  }
};

export const getEventUserPhotos: RequestHandler = async (req, res) => {
  const { eventId, userId } = req.params;

  try {
    const photos = await getUserPhotosByEventId(eventId, userId);

    if (!photos || photos.length === 0) {
      res.status(404).json({ message: 'No photos found for this event.' });
      return;
    }

    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event photos.', error });
  }
};

export const getPhotoIncludeUsers = async (req: Request, res: Response) => {
  const { photoId } = req.params;

  try {
    const photo = await getPhotoWithUsers(photoId);
    res.status(200).json(photo);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};

export async function getEventUsersExcludingPhotoUsers(
  req: Request,
  res: Response
) {
  try {
    const { eventId, photoId } = req.params;

    if (!eventId || !photoId) {
      res.status(400).json({ error: 'Missing eventId or photoId' });
      return;
    }

    const result = await EventService.fetchUsersNotInPhoto(eventId, photoId);

    res.status(200).json(result);
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
    return;
  }
}

export const addUserTagToPhoto: RequestHandler = async (req, res) => {
  const { photoId, userId, position } = req.params;

  try {
    if (!photoId || !userId || !position) {
      res.status(400).json({ message: 'Missing photoId, userId or position.' });
      return;
    }

    // Add userId to the photo
    await EventService.addUserTag(photoId, userId, position);

    res.status(200).json({
      message: 'UserTag added successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add UserTag.', error });
  }
};

export const removeUserTagFromPhoto: RequestHandler = async (req, res) => {
  const { photoId, userId } = req.params;

  try {
    if (!photoId || !userId) {
      res.status(400).json({ message: 'Missing photoId or userId.' });
      return;
    }

    // Remove userId from the photo
    await EventService.removeUserTag(photoId, userId);

    res.status(200).json({
      message: 'UserTag removed successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove UserTag.', error });
  }
};

export const createPhotoGroup: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  const { name, userIds } = req.body;

  try {
    if (!eventId || !name || !userIds || userIds.length === 0) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }
    let eid = new mongoose.Types.ObjectId(eventId);

    let photoGroup: Partial<IPhotoGroup> = { eventId: eid, name, userIds };
    const newPhotoGroup = await PhotoGroupService.createPhotoGroup(photoGroup);

    res.status(201).json(newPhotoGroup);
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to create photo group. for: ${error.message}`,
      error,
    });
  }
};

export const updatePhotoGroup: RequestHandler = async (req, res) => {
  const { eventId, groupId } = req.params;
  const { name, userIds, description } = req.body;

  try {
    if (!eventId || !groupId) {
      res.status(400).json({ message: 'Missing eventId or groupId.' });
      return;
    }

    let updateData: Partial<IPhotoGroup> = {};
    if (name) updateData.name = name;
    if (userIds) updateData.userIds = userIds;
    if (description) updateData.description = description;

    const updatedGroup = await PhotoGroupService.updatePhotoGroup(
      groupId,
      eventId,
      updateData
    );

    if (!updatedGroup) {
      res.status(404).json({ message: 'Photo group not found.' });
      return;
    }

    res.status(200).json(updatedGroup);
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to update photo group. for: ${error.message}`,
      error,
    });
  }
};

export const deletePhotoGroup: RequestHandler = async (req, res) => {
  const { eventId, groupId } = req.params;

  try {
    if (!eventId || !groupId) {
      res.status(400).json({ message: 'Missing eventId or groupId.' });
      return;
    }

    const deletedGroup = await PhotoGroupService.deletePhotoGroup(groupId);

    if (!deletedGroup) {
      res.status(404).json({ message: 'Photo group not found.' });
      return;
    }

    res.status(200).json({ message: 'Photo group deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to delete photo group. for: ${error.message}`,
      error,
    });
  }
};

export const getEventPhotoGroups: RequestHandler = async (req, res) => {
  try {
    let result = await PhotoGroupService.getEventPhotoGroups(
      req.params.eventId
    );
    if (!result) {
      res
        .status(404)
        .json({ message: 'No photo groups found for this event.' });
      return;
    }
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to delete photo group. for: ${error.message}`,
      error,
    });
  }
};

export const getEventPhotoGroupsForUser: RequestHandler = async (req, res) => {
  try {
    let result = await PhotoGroupService.getEventPhotoGroupsForUser(
      req.params.eventId,
      req.params.userId
    );
    if (!result) {
      res
        .status(404)
        .json({ message: 'No photo groups found for this event.' });
      return;
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to delete photo group. for: ${error.message}`,
      error,
    });
  }
};

export const getPhotoGroupById = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const photoGroup = await PhotoGroupService.getPhotoGroupById(groupId);

    if (!photoGroup) {
      res.status(404).json({ message: 'Photo group not found' });
      return;
    }

    res.status(200).json(photoGroup);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};
