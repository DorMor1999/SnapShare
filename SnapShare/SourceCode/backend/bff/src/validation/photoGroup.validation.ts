import Joi from "joi";

export const createPhotoGroupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Photo Group name is required",
    "string.min": "Photo Group name must be at least 2 characters long",
    "string.max": "Photo Group name must not exceed 100 characters",
  }),
  userIds: Joi.array().items(Joi.string()).optional(),
  description: Joi.string().max(500).optional().messages({
    "string.max": "Description must not exceed 500 characters",
  }),
});

export const updatePhotoGroupSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional().messages({
      "string.empty": "Photo Group name is required",
      "string.min": "Photo Group name must be at least 2 characters long",
      "string.max": "Photo Group name must not exceed 100 characters",
    }),
    userIds: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().max(500).optional().messages({
      "string.max": "Description must not exceed 500 characters",
    }),
  });