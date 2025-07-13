import Joi from 'joi';

export const createEventValidation = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().max(500),
  location: Joi.string().max(200),
  image: Joi.string().uri(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required()
});

export const updateEventValidation = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(500),
  location: Joi.string().max(200),
  image: Joi.string().uri(),
  startTime: Joi.date(),
  endTime: Joi.date()
});

