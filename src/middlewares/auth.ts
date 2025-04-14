import { authService } from '../services/auth.js';
import type { NextFunction, Request, Response } from 'express';
import type { CommonResponse } from '../utils/types/express.js';
import type { User } from '@prisma/client';
import { HttpError } from '../utils/error.js';

async function isAuthorized(
    req: Request,
    res: Response<CommonResponse, { user: User }>,
    next: NextFunction
){
    const { accessToken } = req.cookies;

    if (!accessToken) {
        throw new HttpError('Unauthorized', 401);
    }

    const user = await authService.verifyToken( accessToken as string );

    res.locals.user = user;
    next();
}

async function isValidAccessToken(
    req: Request,
    res: Response<CommonResponse, { user: User }>,
    next: NextFunction
): Promise<void> {
    const { accessToken } = req.cookies;

    if (!accessToken) {
        throw new HttpError('Unauthorized', 401);
    }

    const user = await authService.verifyTokenIgnoreExpiration(accessToken as string);

    res.locals.user = user;
    next();
}

export const authMiddleware = {
    isAuthorized,
    isValidAccessToken
};