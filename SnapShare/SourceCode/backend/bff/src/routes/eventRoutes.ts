import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  getUserEvents,
  recognizeEventPhotos,
  getEventPhotos,
  getEventUserPhotos,
  getPhotoIncludeUsers,
  getEventUsersExcludingPhotoUsers,
  addUserTagToPhoto,
  removeUserTagFromPhoto,
  createPhotoGroup,
  updatePhotoGroup,
  deletePhotoGroup,
  getEventPhotoGroups,
  getEventPhotoGroupsForUser
} from '../controllers/event.controller';
import {
  createEventSchema,
  updateEventSchema,
} from '../validation/event.validation';
import { validateRequest } from '../middlewares/validations.middleware';
import { uploadEventPhotos } from "../controllers/event.controller";
import { parseFormData } from "../middlewares/multer.middleware";
import { createPhotoGroupSchema, updatePhotoGroupSchema } from '../validation/photoGroup.validation';
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
router.get("/:eventId/photos", getEventPhotos);
router.get("/:eventId/user-photos/:userId", getEventUserPhotos);
router.get("/:eventId/photos/:photoId", getPhotoIncludeUsers);
router.get("/:eventId/photos/:photoId/users-exclude-photo", getEventUsersExcludingPhotoUsers);
router.patch("/:eventId/photo/:photoId/user/:userId/position/:position", addUserTagToPhoto);
router.patch("/:eventId/photo/:photoId/user/:userId", removeUserTagFromPhoto);
router.post('/:eventId/photo-group', validateRequest(createPhotoGroupSchema), createPhotoGroup);
router.put('/:eventId/photo-group/:groupId', validateRequest(updatePhotoGroupSchema), updatePhotoGroup);
router.delete('/:eventId/photo-group/:groupId', deletePhotoGroup);
router.get('/:eventId/photo-group', getEventPhotoGroups);
router.get('/:eventId/photo-group/user/:userId', getEventPhotoGroupsForUser);

export default router;
