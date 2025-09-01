import { communityService } from '../services/community.js';
import type { Request, Response, NextFunction } from 'express';
import type { ValidCreateCommunitySchema } from './validation/communities.js';
import type { Community, User } from '@prisma/client';
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

async function getAndCheckUserAccessToCommunity(
  req: Request<{ id: string }>,
  res: Response<
    CommonResponse,
    { community: Community; user: User | undefined }
  >,
  next: NextFunction
) {
  const { id: communityId } = req.params;
  const user = res.locals.user;

  const { community } = await communityService.getAndCheckUserAccessToCommunity(
    user?.id,
    communityId
  );

  res.locals.community = community;

  next();
}

export const communityMiddleware = {
  blockIfCommunityNameExists,
  getAndCheckUserAccessToCommunity
};
