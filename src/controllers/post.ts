import { createPostService } from '../services/post.js';
import type { ValidCreatePostSchema } from '../middlewares/validation/posts.js';
import type { Request, Response } from 'express';
import type { CommonResponse } from '../utils/types/express.js';
import type { User } from '@prisma/client';

async function createPostController(
  req: Request<unknown, unknown, ValidCreatePostSchema>,
  res: Response<CommonResponse, { user: User }>
) {
  const body = req.body;
  const { id } = res.locals.user;

  await createPostService.createPost(body, id);

  res.status(201).json({
    message: 'Successfully create post'
  });
}

export const postController = {
  createPostController
};
