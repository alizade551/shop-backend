import * as Joi from 'joi';

export const ENV_VALIDATION_SCHEMA = Joi.object({
  DATABASE_NAME: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_USERNAME: Joi.required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_HOST: Joi.required(),
  DATABASE_TYPE: Joi.required(),
  DATABASE_URL: Joi.required(),
  JWT_SECRET: Joi.required(),
  JWT_TTL: Joi.required(),
});
