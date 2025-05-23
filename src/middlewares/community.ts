import { communityService } from '../services/community.js';
import type { Request, Response, NextFunction } from 'express';
import type { ValidCreateCommunitySchema } from './validation/communities.js';
import type { User } from '@prisma/client';
import type { CommonResponse } from '../utils/types/express.js';

async function blockIfCommunityNameExists(
  req: Request<unknown, unknown, ValidCreateCommunitySchema>,
  _res: Response<CommonResponse, { user: User }>,
  next: NextFunction
) {
  const { name } = req.body;

  await communityService.blockIfCommunityNameExists(name);

  next();
}

export const communityMiddleware = {
  blockIfCommunityNameExists
};
