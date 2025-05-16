import { Request, Response } from 'express';
import * as InvitationDAL from '../dal/invitation.dal';
import * as InvitationService from "../services/invitation.service";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const invitation = await InvitationService.createInvitation(req.body);
    res.status(201).json(invitation);
  } catch (err) {
    res.status(400).json({ message: err instanceof Error ? err.message : "Failed to create invitation" });
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
    const updated = await InvitationService.updateInvitation(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update invitation", error: err });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await InvitationService.deleteInvitation(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting invitation", error: err });
  }
};

export const getInvitationsByEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { filterBy } = req.query;

    const invitations = await InvitationService.getInvitationsByEvent(eventId, filterBy as string);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invitations by event", error });
  }
};

export const getInvitationsByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const { filterBy } = req.query;

    const invitations = await InvitationService.getInvitationsByEmail(email, filterBy as string);
    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invitations by email", error });
  }
};

export const acceptInvitation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await InvitationService.acceptInvitation(id);
    res.status(200).json({ message: "Invitation accepted", result });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to accept invitation" });
  }
};

export const createBatchInvitations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file || !req.file.buffer) {
      res.status(400).json({ message: "Excel file is required" });
      return;
    }

    const eventId = req.body.eventId;
    if (!eventId) {
      res.status(400).json({ message: "Event ID is required" });
      return;
    }

    const invitations = await InvitationService.createBatchInvitations(req.file.buffer, eventId);
    res.status(201).json({ message: "Invitations created successfully", invitations });
  } catch (err) {
    res.status(400).json({ message: err instanceof Error ? err.message : "Batch invitation creation failed" });
  }
};
