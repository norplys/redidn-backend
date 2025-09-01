import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/error.js';
import type { CommonResponse } from '../../utils/types/express.js';
import type { CommunityType } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

export const ALLOWED_COMMUNITY_TYPE = [
    'PRIVATE',
    'PUBLIC'
  ] as const satisfies CommunityType[];

const createCommunitySchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    type: z.enum(ALLOWED_COMMUNITY_TYPE),
    mature: z.boolean().optional(),
    banner: z.string().optional(),
    icon: z.string().optional(),
    topics: z.array(z.string()).min(1)
}).strict();

export type ValidCreateCommunitySchema = z.infer<typeof createCommunitySchema>;

function isValidCreateCommunityPayload(
    req: Request<unknown, unknown, ValidCreateCommunitySchema>,
    _res: Response<CommonResponse>,
    next: NextFunction
) {
    const body = req.body;
    const result = createCommunitySchema.safeParse(body);

    if (!result.success) {
        const formattedError = formatZodError(result.error);

        throw new HttpError(formattedError, 400);
    }

    next();
}

export const communityValidationMiddleware = {
    isValidCreateCommunityPayload
};

