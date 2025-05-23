import { communityService } from '../services/community.js';
import type { Request, Response } from 'express';
import type { ValidCreateCommunitySchema } from '../middlewares/validation/communities.js';
import type { User } from '@prisma/client';
import type { CommonResponse } from '../utils/types/express.js';

async function createCommunity(
  req: Request<unknown, unknown, ValidCreateCommunitySchema>,
  res: Response<CommonResponse, { user: User }>
) {
  const { id } = res.locals.user;
  const payload = req.body;

  await communityService.createCommunity(payload, id);

  res.status(201).json({
    message: 'Community created successfully'
  });
}

export const communityController = {
  createCommunity
};
