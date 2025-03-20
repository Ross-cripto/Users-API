import * as joi from 'joi';
import 'dotenv/config'


/**
 * @interface EnvVars
 * @description Interface to define the environment variables.
 * PORT: The port number to run the server on.
 * JWT_SECRET: The secret key used to sign and verify JWT tokens.
 * DATABASE_URL: The URL of the database to connect to.
 */

interface EnvVars {
  PORT: number;
  JWT_SECRET: string;
  DATABASE_URL: string;
}

/**
 * @constant envsSchema
 * @description Joi schema to validate the environment variables.
 */

const envSchema = joi.object({
  PORT: joi.number().required(),
  JWT_SECRET: joi.string().required(),
  DATABASE_URL: joi.string().required(),
})
  .unknown(true);

const { error, value } = envSchema.validate(process.env);	

if (error) {
  throw new Error(`Config Validation Error ${error.message}`);
}

const envVars: EnvVars = value;

export const env = {
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  databaseUrl: envVars.DATABASE_URL,
};