import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/error.js';
import type { CommonResponse } from '../../utils/types/express.js';
import type { NextFunction, Request, Response } from 'express';

export const validIdParamsSchema = z
  .object({
    id: z.string().uuid()
  })
  .strict();

export type ValidIdParamsSchema = z.infer<typeof validIdParamsSchema>;

function isValidIdParams(
  req: Request<ValidIdParamsSchema>,
  _res: Response<CommonResponse>,
  next: NextFunction
) {
  const params = req.params;
  const result = validIdParamsSchema.safeParse(params);

  if (!result.success) {
    const formattedError = formatZodError(result.error);

    throw new HttpError(formattedError, 400);
  }

  next();
}

export const commonValidationMiddleware = {
  isValidIdParams
};
