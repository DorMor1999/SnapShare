import { Request, Response, RequestHandler } from 'express';
import { getUserById } from '../services/user.service';
import * as EventService from '../services/event.service';

export const getAllEvents: RequestHandler = async (req, res) => {
  try {
    const events = await EventService.getAllEvents();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching events", error: err });
  }
};

export const createEvent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, date, ownerId } = req.body;

    const user = await getUserById(ownerId);
    if(!user){
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
      photoGroups: [],
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: "Error creating event", error: err });
  }
};

export const getEventById: RequestHandler = async (req, res) => {
  try {
    const event = await EventService.getEventById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err });
  }
};

export const updateEventById: RequestHandler = async (req, res) => {
  try {
    const updatedEvent = await EventService.updateEventById(req.params.id, req.body);
    if (!updatedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Error updating event", error: err });
  }
};

export const deleteEventById: RequestHandler = async (req, res) => {
  try {
    const deleted = await EventService.deleteEventById(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event", error: err });
  }
};

export const getUserEvents: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  const { sortBy = "date", orderBy = "asc" } = req.query;

  const validSortFields = ["date", "name"];
  if (!validSortFields.includes(sortBy as string)) {
    res.status(400).json({ message: "Invalid sort field." });
    return;
  }

  const sortOrder = orderBy === "desc" ? -1 : 1;

  try {
    const events = await EventService.getUserEvents(userId, sortBy as string, sortOrder);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user events", error });
  }
};

export const uploadEventPhotos: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    res.status(400).json({ message: "No files uploaded." });
    return;
  }

  try {
    const updatedEvent = await EventService.uploadEventPhotos(eventId, files);

    if (!updatedEvent) {
      res.status(404).json({ message: "Event not found." });
      return;
    }

    res.status(200).json({
      message: "Photos uploaded successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload photos.", error });
  }
};

export const recognizeEventPhotos: RequestHandler = async (req, res) => {
  const { eventId } = req.params;
  let { photoIds } = req.body as { photoIds: string[] | undefined };

  try {
    if(!photoIds || photoIds.length === 0) {
      photoIds = [];
    }
    const recognitionResults = await EventService.recognizeEventPhotos(eventId, photoIds);

    if (!recognitionResults) {
      res.status(404).json({ message: "Event or photos not found." });
      return;
    }

    res.status(200).json({
      message: "Photo recognition completed successfully.",
      results: recognitionResults,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to recognize photos.", error });
  }
};