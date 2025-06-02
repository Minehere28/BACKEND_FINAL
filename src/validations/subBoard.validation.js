import Joi from 'joi';

const createSubBoardValidation = Joi.object({
  name: Joi.string().valid('TODO', 'IN PROGRESS', 'IN REVIEW', 'DONE', 'ARCHIVE').required()
});

export {
  createSubBoardValidation
};