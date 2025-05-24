import { prisma } from '../utils/db.js';
import type { ValidCreatePostSchema } from '../middlewares/validation/posts.js';

async function createPost(payload: ValidCreatePostSchema, userId: string) {
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
