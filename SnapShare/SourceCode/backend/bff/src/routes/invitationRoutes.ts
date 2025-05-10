import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {create, getAll, getById, remove, update, getInvitationsByEvent, getInvitationsByEmail, acceptInvitation, createBatchInvitations} from '../controllers/invitation.controller';
import { validateRequest } from '../middlewares/validations.middleware';
import {
  createInvitationSchema,
  updateInvitationSchema,
} from '../validation/invitation.validation';
import multer from 'multer';

const router = Router();
const upload = multer();

// Protect all routes
router.use(authenticateToken);

router.post('/',validateRequest(createInvitationSchema), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validateRequest(updateInvitationSchema), update);
router.delete('/:id', remove);
router.get('/event/:eventId', getInvitationsByEvent);
router.get('/email/:email', getInvitationsByEmail);
router.post('/:id/accept', acceptInvitation);
router.post('/createBatchInvitations', upload.single('file'), createBatchInvitations);

export default router;
