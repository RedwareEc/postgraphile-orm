import dotenv from 'dotenv';
import Joi from 'joi';
import { schema, Env } from './config/env';
// Load en variables
dotenv.config();
// Validate env variables
try {
  Joi.assert(process.env, schema);
} catch (error) {
  console.error(error.details)
  process.exit(1);
}
// Assign env if override proccess.env
// const env = (process.env as unknown) as Env;
