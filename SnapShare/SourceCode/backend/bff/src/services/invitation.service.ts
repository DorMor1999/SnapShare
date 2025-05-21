import * as InvitationDAL from "../dal/invitation.dal";
import { getUserByEmail } from "./user.service";
import { sendEventInvitationEmail } from "./email.service";
import { extractInvitationsFromExcel } from "./excel.service";
import { findById as findEventById, updateEventSetById } from "../dal/event.dal";
import { IInvitation } from "../models/invitation.model";
import { executeTransaction } from "../dal/transaction.manager.dal";
import { IUser } from "../models/user.model";
import { IEvent } from "../models/event.model";

export const createInvitation = async (data: Partial<IInvitation>): Promise<IInvitation> => {
    const existingInvitation = await InvitationDAL.findInvitation({
        email: data.email,
        eventId: data.eventId,
        status: "PENDING",
    });

    if (existingInvitation) {
        throw new Error("Invitation with this email and event is already pending");
    }

    const user = await getUserByEmail(data.email!);
    const event = await findEventById(data.eventId!.toString());

    if (!event) {
        throw new Error("Event does not exist");
    }

    if (user) {
        const userIdStr = user._id.toString();
        if (
        event.participants.some((p) => p._id.toString() === userIdStr) ||
        event.owners.some((o) => o._id.toString() === userIdStr)
        ) {
        throw new Error("This user is already a participant or owner.");
        }
    }
    let invitation: IInvitation;
    await executeTransaction(async (session) => {
        invitation = await createAndSendInvitationSession(session, data, event);
    });

    return invitation!;
};

const createAndSendInvitationSession = async (session: any, invitationData: Partial<IInvitation>, event: IEvent): Promise<IInvitation> => {
    const invitation = await InvitationDAL.createInvitation(invitationData, session);

    await sendEventInvitationEmail(
        invitationData.firstName!,
        invitationData.lastName!,
        invitationData.email!,
        event.name || "Unnamed Event"
    );

    return invitation;
};

export const createBatchInvitations = async (fileBuffer: Buffer, eventId: string): Promise<Partial<IInvitation>[]> => {
  const invitationsData = extractInvitationsFromExcel(fileBuffer, eventId);

  for (const invitation of invitationsData) {
    const existing = await InvitationDAL.findInvitation({
      email: invitation.email,
      eventId: invitation.eventId,
      status: "PENDING",
    });

    if (existing) {
      throw new Error(`Pending invitation already exists for ${invitation.email} in event ${invitation.eventId}`);
    }

    const user = await getUserByEmail(invitation.email);
    const event = await findEventById(invitation.eventId);
    if (!event) throw new Error(`Event not found: ${invitation.eventId}`);

    if (user) {
      const userId = user._id.toString();
      if (
        event.owners.some((o) => o._id.toString() === userId) ||
        event.participants.some((p) => p._id.toString() === userId)
      ) {
        throw new Error(`User ${invitation.email} is already in event ${invitation.eventId}`);
      }
    }
  }


  let createdInvitations: Partial<IInvitation>[];
    await executeTransaction(async (session) => {
        createdInvitations = await createAndSendBatchInvitationsSession(session, invitationsData);
    });

  return createdInvitations!;
};

const createAndSendBatchInvitationsSession = async (session: any, invitationsData: any[]): Promise<Partial<IInvitation>[]> => {
    const createdInvitations = await InvitationDAL.createManyInvitations(invitationsData, session);

    for (const invitation of invitationsData) {
        const event = await findEventById(invitation.eventId);
        await sendEventInvitationEmail(
        invitation.firstName,
        invitation.lastName,
        invitation.email,
        event?.name || "Unnamed Event"
        );
    }

  return createdInvitations;
}

export const updateInvitation = async (id: string, updateData: Partial<IInvitation>): Promise<IInvitation | null> => {
    return await InvitationDAL.updateInvitation(id, updateData);
};

export const deleteInvitation = async (id: string): Promise<boolean> => {
    return await InvitationDAL.deleteInvitation(id);
};

export const getInvitationsByEvent = async (eventId: string, filterBy?: string): Promise<IInvitation[]> => {  
    const allowedStatuses = ['ACCEPTED', 'PENDING', 'DECLINED'] as const;

    if (
      filterBy &&
      !allowedStatuses.includes(filterBy as (typeof allowedStatuses)[number])
    ) {
        throw new Error(`Invalid filterBy value: ${filterBy}`);
    }
 
    return await InvitationDAL.findInvitationsByEvent(eventId, filterBy);
};

export const getInvitationsByEmail = async (email: string, filterBy?: string): Promise<IInvitation[]> => {
    const allowedStatuses = ['ACCEPTED', 'PENDING', 'DECLINED'] as const;

    if (
      filterBy &&
      !allowedStatuses.includes(filterBy as (typeof allowedStatuses)[number])
    ) {
        throw new Error(`Invalid filterBy value: ${filterBy}`);
    }

    return await InvitationDAL.findInvitationsByEmail(email, filterBy);
};

export const acceptInvitation = async (id: string): Promise<IInvitation | null> => {
    let invitation = await InvitationDAL.getInvitationById(id);
    if(!invitation || invitation == null) throw new Error("Invitation not found");

    if (invitation.status !== "PENDING") throw new Error("Only pending invitations can be accepted");

    // Find the user by email
    const user = await getUserByEmail(invitation.email);
    if (!user) throw new Error("User with this email not found");

    await executeTransaction(async (session) => {
        invitation = await acceptInvitationSession(session, invitation!, user);
    });
    
    return invitation;
};

const acceptInvitationSession = async (session: any, invitation: IInvitation, user: IUser): Promise<IInvitation> => {
    // Update the invitation status to "ACCEPTED"
    let result = await InvitationDAL.acceptInvitation(invitation._id.toString(), session);
    // invitation = await invitation.save({ session });
    invitation = result!;

    const updateField =
        invitation.type === "OWNER"
            ? { $addToSet: { owners: user._id } }
            : { $addToSet: { participants: user._id } };
    
    await updateEventSetById(invitation.eventId.toString(), updateField, session);
    
    return invitation;
};

