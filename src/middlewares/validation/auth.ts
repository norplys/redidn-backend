import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import { formatZodError, HttpError } from '../../utils/error.js';

const registerPayload = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  name: z.string().optional(),
  password: z.string().min(6),
  phoneNumber: z.string().min(10).max(10).optional(),
  age: z.number().int().min(18).optional()
}).strict();

export type ValidRegisterSchema = z.infer<typeof registerPayload>;

function isValidRegisterPayload(
  req: Request<unknown, unknown, ValidRegisterSchema>,
  _res: Response,
  next: NextFunction
) {
  const body = req.body;
  const result = registerPayload.safeParse(body);

  if (!result.success) {
    const formattedError = formatZodError(result.error);

    throw new HttpError(formattedError, 400);
  }

  next();
}


export const authValidationMiddleware = {
  isValidRegisterPayload
};