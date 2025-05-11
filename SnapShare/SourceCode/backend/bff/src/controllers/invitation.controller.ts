import { Request, Response } from 'express';
import * as InvitationDAL from '../dal/invitation.dal';
import { findById } from '../dal/event.dal';
import { getUserByEmailService } from '../services/user.service';
import { sendEventInvitationEmail } from '../services/email.service';
import { extractInvitationsFromExcel } from '../services/excel.service';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const existingInvitation = await InvitationDAL.findInvitation({
      email: req.body.email,
      eventId: req.body.eventId,
      status: 'PENDING',
    });

    if (existingInvitation) {
      res.status(400).json({
        message: 'Invitation with this email and event is already pending',
      });
      return;
    }

    const user = await getUserByEmailService(req.body.email);
    const event = await findById(req.body.eventId);
    if (!event) {
      res.status(400).json({
        message: 'Event not exist',
      });
      return;
    }

    if (user && event) {
      const userIdStr = user._id.toString();
      if (
        event.participants.some((p) => p.toString() === userIdStr) ||
        event.owners.some((o) => o.toString() === userIdStr)
      ) {
        res.status(400).json({
          message: 'This user is already a participant or owner.',
        });
        return;
      }
    }

    const invitation = await InvitationDAL.createInvitation(req.body);
    await sendEventInvitationEmail(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      event && typeof event.name === 'string' ? event.name : 'Unnamed Event'
    );
    res.status(201).json(invitation);
    return;
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to create invitation', error: err });
    return;
  }
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const invitations = await InvitationDAL.getInvitations();
    res.json(invitations);
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invitations', error: err });
    return;
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invitation = await InvitationDAL.getInvitationById(req.params.id);
    if (!invitation) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(invitation);
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invitation', error: err });
    return;
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await InvitationDAL.updateInvitation(
      req.params.id,
      req.body
    );
    if (!updated) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(updated);
    return;
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to update invitation', error: err });
    return;
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await InvitationDAL.deleteInvitation(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error deleting invitation', error: err });
    return;
  }
};

export const getInvitationsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { filterBy } = req.query;

    const allowedStatuses = ['ACCEPTED', 'PENDING', 'DECLINED'] as const;

    if (
      filterBy &&
      !allowedStatuses.includes(filterBy as (typeof allowedStatuses)[number])
    ) {
      res.status(400).json({ message: 'Invalid filterBy value' });
      return;
    }

    const event = await findById(eventId);
    if (!event) {
      res.status(400).json({
        message: 'Event not exist',
      });
      return;
    }

    const invitations = await InvitationDAL.findInvitationsByEvent(
      eventId,
      filterBy as string
    );

    res.status(200).json(invitations);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch invitations by event', error });
    return;
  }
};

export const getInvitationsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { filterBy } = req.query;

    const allowedStatuses = ['ACCEPTED', 'PENDING', 'DECLINED'] as const;

    if (
      filterBy &&
      !allowedStatuses.includes(filterBy as (typeof allowedStatuses)[number])
    ) {
      res.status(400).json({ message: 'Invalid filterBy value' });
      return;
    }

    const invitations = await InvitationDAL.findInvitationsByEmail(
      email,
      filterBy as string
    );

    res.status(200).json(invitations);
    return;
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch invitations by email', error });
    return;
  }
};

export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await InvitationDAL.acceptInvitation(id);
    res.status(200).json({ message: 'Invitation accepted', result });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to accept invitation' });
    return;
  }
};

export const createBatchInvitations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ message: 'Excel file is required' });
      return;
    }

    const eventId = req.body.eventId;
    if (!eventId) {
      res.status(400).json({ message: 'Event ID is required' });
      return;
    }

    // Extract and validate invitations from the uploaded Excel file
    const invitationsData = extractInvitationsFromExcel(
      req.file.buffer,
      eventId
    );

    // Validate all invitations before inserting
    for (const invitation of invitationsData) {
      const existing = await InvitationDAL.findInvitation({
        email: invitation.email,
        eventId: invitation.eventId,
        status: 'PENDING',
      });

      if (existing) {
        throw new Error(
          `Pending invitation already exists for ${invitation.email} in event ${invitation.eventId}`
        );
      }

      const user = await getUserByEmailService(invitation.email);
      const event = await findById(invitation.eventId);
      if (!event) throw new Error(`Event not found: ${invitation.eventId}`);

      if (user) {
        const userId = user._id.toString();
        if (
          event.owners.some((o) => o.toString() === userId) ||
          event.participants.some((p) => p.toString() === userId)
        ) {
          throw new Error(
            `User ${invitation.email} is already in event ${invitation.eventId}`
          );
        }
      }
    }

    // All validated, create invitations
    const createdInvitations = await InvitationDAL.createManyInvitations(
      invitationsData
    );

    //send emails
    for(let invitationData of invitationsData){
      const event = await findById(invitationData.eventId);
      await sendEventInvitationEmail(
      invitationData.firstName,
      invitationData.lastName,
      invitationData.email,
      event && typeof event.name === 'string' ? event.name : 'Unnamed Event'
    );
    }
    res
      .status(201)
      .json({
        message: 'Invitations created successfully',
        invitations: createdInvitations,
      });
    return;
  } catch (error) {
    res
      .status(400)
      .json({
        message: 'Batch invitation creation failed',
        error: error instanceof Error ? error.message : error,
      });
    return;
  }
};
