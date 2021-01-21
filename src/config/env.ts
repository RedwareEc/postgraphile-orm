import Joi from 'joi';

export interface Env {
  NODE_ENV: 'production' | 'development';
}

export const schema = Joi.object<Env>()
  .keys({
    NODE_ENV: Joi.string(),
  })
  .options({ allowUnknown: true });
