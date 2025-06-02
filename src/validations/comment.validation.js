import Joi from 'joi';

const createCommentValidation = Joi.object({
  content: Joi.string().required().max(500)
});

export {
  createCommentValidation
};