import { PrismaClient } from '@prisma/client';
import { appEnv } from './env.js';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: appEnv.DATABASE_URL
    }
  }
});
