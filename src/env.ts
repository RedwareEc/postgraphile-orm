import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();

/**
 * Define Schema
 */
const env = {
  NODE_ENV: Joi.string(),
  PORT: Joi.number().default(3015),
};

/**
 * Verify schema
 */
try {
  Joi.assert(process.env, Joi.object(env), { allowUnknown: true });
} catch (error) {
  console.error(error.details);
  process.exit(1);
}
/**
 * Parse ENV
 */
for (const key in env) {
  process.env[key] = Joi.attempt(process.env[key], (env as any)[key]);
}
/**
 * Add extra functions
 */
