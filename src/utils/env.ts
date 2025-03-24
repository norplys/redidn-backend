import dotenv from 'dotenv';
import { z } from 'zod';
import { validStringSchema } from './validation.js';
import { logger } from '../loaders/pino.js';
import { access } from 'fs/promises';

const envPayload = z.object({
  PORT: validStringSchema,

  //#DATABASE
  DATABASE_URL: validStringSchema,

  //#JWT
  SECRET_KEY: validStringSchema,

  //#OAUTH
  GOOGLE_CLIENT_ID: validStringSchema,
  GOOGLE_CLIENT_SECRET: validStringSchema,
  GOOGLE_REDIRECT_URL: validStringSchema,

  //#NODEMAILER
  EMAIL: validStringSchema,
  EMAIL_PASSWORD: validStringSchema,

  //#MIDTRANS
  MIDTRANS_SERVER_KEY: validStringSchema,
  MIDTRANS_CLIENT_KEY: validStringSchema,
  MIDTRANS_IS_PRODUCTION: validStringSchema,
  MIDTRANS_TOKEN: validStringSchema,

  //#CORS
  VALID_ORIGINS: validStringSchema,

  //#BACKEND
  PUBLIC_BACKEND_URL: validStringSchema,
  PUBLIC_FRONTEND_URL: validStringSchema,

  //#SUPABASE
  SUPABASE_API_KEY: validStringSchema,
  SUPABASE_URL: validStringSchema,

  //#SUPERADMIN
  SUPERADMIN_EMAIL: validStringSchema,
  SUPERADMIN_PASSWORD: validStringSchema
});

type EnvSchema = z.infer<typeof envPayload>;

function validateEnv(): EnvSchema{
  const PORT = process.env.PORT ?? process.env.HOST_PORT;

  const mergedEnv = { 
    ...process.env, 
    PORT: PORT 
  };

  const result = envPayload.parse(mergedEnv);

  return result;
}
 

async function loadEnv(): Promise<void> {
  const isRunnningOnDevelopment = process.env.NODE_ENV === 'development';

  let envPath;

  if (isRunnningOnDevelopment) {
    const isLocalEnvExist = await access('.env.local')
      .then(() => true)
      .catch(() => false);

    if (!isLocalEnvExist) {
      throw new Error('Missing .env.local file');
    }

    envPath = '.env.local';

    logger.info('Loading environment variables from .env.local');
  } else {
    logger.info('Loading environment variables from .env or process.env');
  }

  dotenv.config({ path: envPath });
}

await loadEnv();

export const appEnv = validateEnv();

