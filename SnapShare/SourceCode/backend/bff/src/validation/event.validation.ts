import Joi from "joi";

export const createEventSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Event name is required",
    "string.min": "Event name must be at least 2 characters long",
    "string.max": "Event name must not exceed 100 characters",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Date must be a valid ISO format",
    "any.required": "Event date is required",
  }),
  ownerId: Joi.string().required().messages({
    "string.empty": "Owner ID is required",
  }),
});

export const updateEventSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.empty": "Event name cannot be empty",
    "string.min": "Event name must be at least 2 characters long",
    "string.max": "Event name must not exceed 100 characters",
  }),
  date: Joi.date().iso().optional().messages({
    "date.base": "Date must be a valid ISO format",
  }),
  owners: Joi.array().items(Joi.string()).optional(),
  participants: Joi.array().items(Joi.string()).optional(),
  photoGroups: Joi.array().items(Joi.string()).optional(),
});
