import { prisma } from '../utils/db.js';
import type { ValidCreatePostSchema } from '../middlewares/validation/posts.js';
import { communityService } from './community.js';

async function createPost(payload: ValidCreatePostSchema, userId: string) {
  if (payload?.communityId) {
    await communityService.getAndCheckUserAccessToCommunity(
      userId,
      payload.communityId
    );
  }
  
  await prisma.post.create({
    data: {
      ...payload,
      userId
    }
  });
}

export const createPostService = {
  createPost
};
