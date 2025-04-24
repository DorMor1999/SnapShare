import { Request, Response, RequestHandler } from 'express';
import * as eventDal from '../dal/event.dal';
import { SortOrder } from 'mongoose';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventDal.findAll();
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

    if (!name || !date || !ownerId) {
      res.status(400).json({ message: 'Missing required fields' });
    }

    const newEvent = await eventDal.create({
      name,
      date,
      owners: [ownerId],
      participants: [],
      photoGroups: [],
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err });
  }
};

export const getEventById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await eventDal.findById(req.params.id);
    if (!event) res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err });
  }
};

export const updateEventById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedEvent = await eventDal.update(req.params.id, req.body);
    if (!updatedEvent) res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err });
  }
};

export const deleteEventById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await eventDal.remove(req.params.id);
    if (!deleted) res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err });
  }
};

export const getUserEvents: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { sortBy = 'date', orderBy = 'asc' } = req.query;

  // Define valid fields for sorting
  const validSortFields = ['date', 'name'];

  // Ensure sortBy is a valid field
  if (!validSortFields.includes(sortBy as string)) {
    res.status(400).json({ message: 'Invalid sort field.' });
  }

  // Ensure orderBy is either 'asc' or 'desc'
  const sortOrder: SortOrder = orderBy === 'desc' ? -1 : 1;

  try {
    const events = await eventDal.findByUserIdSorted(
      userId,
      sortBy as string,
      sortOrder
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user events',
      error,
    });
  }
};
