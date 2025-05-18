import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  getUserEvents,
  recognizeEventPhotos
} from '../controllers/event.controller';
import {
  createEventSchema,
  updateEventSchema,
} from '../validation/event.validation';
import { validateRequest } from '../middlewares/validations.middleware';
import { uploadEventPhotos } from "../controllers/event.controller";
import { parseFormData } from "../middlewares/multer.middleware";

const router = Router();

// Protect all routes
router.use(authenticateToken);

// Routes
router.get('/', getAllEvents);
router.post('/', validateRequest(createEventSchema), createEvent);
router.get('/:id', getEventById);
router.put('/:id', validateRequest(updateEventSchema), updateEventById);
router.delete('/:id', deleteEventById);
router.get('/user/:userId', getUserEvents);
router.post("/:eventId/photos", parseFormData, uploadEventPhotos);
router.post("/:eventId/recognize", recognizeEventPhotos);

export default router;
