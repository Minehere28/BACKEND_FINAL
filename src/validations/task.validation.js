import Joi from 'joi';

const createTaskValidation = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required().max(500),
  dueTime: Joi.date().required(),
  documentLink: Joi.string().uri(),
  githubRepo: Joi.string().uri(),
  team: Joi.string().hex().length(24).required(),
  status: Joi.string().valid('todo', 'in-progress', 'in-review', 'done')
});

const updateTaskValidation = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(500),
  dueTime: Joi.date(),
  documentLink: Joi.string().uri(),
  githubRepo: Joi.string().uri(),
  status: Joi.string().valid('todo', 'in-progress', 'in-review', 'done')
});

export {
  createTaskValidation,
  updateTaskValidation
};