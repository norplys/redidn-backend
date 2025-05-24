import { z } from 'zod';
import type { Response, Request, NextFunction } from 'express';
import { formatZodError, HttpError } from '../../utils/error.js';

const createPostPayload = z
  .object({
    media: z.array(z.string()).optional(),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    tags: z.array(z.string()).optional(),
    communityId: z.string().optional()
  })
  .strict();

export type ValidCreatePostSchema = z.infer<typeof createPostPayload>;

function isValidCreatePostPayload(
  req: Request<unknown, unknown, ValidCreatePostSchema>,
  _res: Response,
  next: NextFunction
) {
  const body = req.body;

  const result = createPostPayload.safeParse(body);

  if (!result.success) {
    const formattedError = formatZodError(result.error);

    throw new HttpError(formattedError, 400);
  }

  next();
}

export const postValidationMiddleware = {
  isValidCreatePostPayload
};
