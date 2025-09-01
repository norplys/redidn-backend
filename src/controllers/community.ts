import { communityService } from '../services/community.js';
import type { Request, Response } from 'express';
import type { ValidCreateCommunitySchema } from '../middlewares/validation/communities.js';
import type { Community, User } from '@prisma/client';
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

async function getAllCommunities(
  _req: Request,
  res: Response<CommonResponse, { user: User }>
) {
  const communities = await communityService.getAllCommunities();

  res.status(200).json({
    message: 'Communities fetched successfully',
    data: communities
  });
}

function getCommunityById(
  _req: Request,
  res: Response<CommonResponse, { community: Community }>
) {
  const community = res.locals.community;

  res.status(200).json({
    message: 'Community fetched successfully',
    data: community
  });
}

export const communityController = {
  createCommunity,
  getAllCommunities,
  getCommunityById
};
