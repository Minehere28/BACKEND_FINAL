import Joi from 'joi';

const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('Admin', 'Member').default('Member'),
  teamId: Joi.string().hex().length(24).required(),
});

const loginValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export {
  registerValidation,
  loginValidation,
};
