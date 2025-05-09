import { Request, Response, RequestHandler } from 'express';
import * as eventDal from '../dal/event.dal';
import { SortOrder } from 'mongoose';
import { getUserByIdService } from '../services/user.service';


export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventDal.findAll();
    res.json(events);
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err });
    return;
  }
};

export const createEvent: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, date, ownerId } = req.body;

    const user = await getUserByIdService(ownerId);
    if(!user){
      res.status(400).json({
        message: 'User not exist',
      });
      return;
    }

    const newEvent = await eventDal.create({
      name,
      date,
      owners: [ownerId],
      participants: [],
      photoGroups: [],
    });

    res.status(201).json(newEvent);
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err });
    return;
  }
};

export const getEventById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await eventDal.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event', error: err });
    return;
  }
};

export const updateEventById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedEvent = await eventDal.update(req.params.id, req.body);
    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(updatedEvent);
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err });
    return;
  }
};

export const deleteEventById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await eventDal.remove(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err });
    return;
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
    return;
  }

  // Ensure orderBy is either 'asc' or 'desc'
  const sortOrder: SortOrder = orderBy === 'desc' ? -1 : 1;

  console.log(sortBy, sortOrder);

  try {
    const events = await eventDal.findByUserIdSorted(
      userId,
      sortBy as string,
      sortOrder
    );
    res.json(events);
    return;
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user events',
      error,
    });
    return;
  }
};
