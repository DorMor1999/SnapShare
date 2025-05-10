import Joi from "joi";

export const createInvitationSchema = Joi.object({
  eventId: Joi.string().required().messages({
    "string.empty": "Event ID is required",
    "any.required": "Event ID is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Must be a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 character",
    "string.max": "First name must not exceed 50 characters",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 character",
    "string.max": "Last name must not exceed 50 characters",
  }),
  type: Joi.string().valid("OWNER", "PARTICIPANT").required().messages({
    "any.only": "Type must be either OWNER or PARTICIPANT",
    "string.empty": "Type is required",
    "any.required": "Type is required",
  }),
});

export const updateInvitationSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    "string.email": "Must be a valid email",
  }),
  firstName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "First name must be at least 2 character",
    "string.max": "First name must not exceed 50 characters",
  }),
  lastName: Joi.string().min(2).max(50).optional().messages({
    "string.min": "Last name must be at least 2 character",
    "string.max": "Last name must not exceed 50 characters",
  }),
  type: Joi.string().valid("OWNER", "PARTICIPANT").optional().messages({
    "any.only": "Type must be either OWNER or PARTICIPANT",
  }),
  status: Joi.string().valid("ACCEPTED", "PENDING", "DECLINED").optional().messages({
    "any.only": "Status must be one of ACCEPTED, PENDING, or DECLINED",
  }),
});