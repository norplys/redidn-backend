import { userService } from '../services/user.js';
import { authService } from '../services/auth.js';
import type {
  ValidLoginSchema,
  ValidRegisterSchema
} from '../middlewares/validation/auth.js';
import type { Request, Response } from 'express';
import type { CommonResponse } from '../utils/types/express.js';
import type { User } from '@prisma/client';

async function register(
  req: Request<unknown, unknown, ValidRegisterSchema>,
  res: Response<CommonResponse>
) {
  const body = req.body;

  await userService.createUser(body);

  res.status(201).json({
    message: 'Successfully register user'
  });
}

async function login(
  req: Request<unknown, unknown, ValidLoginSchema>,
  res: Response<CommonResponse>
) {
  const body = req.body;

  const { accessToken, refreshToken } = await authService.login(body);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
    // path: '/v1/auth/refresh-token'
  });

  res.status(200).json({
    message: 'Successfully login'
  });
}

async function refreshAccessToken(
  req: Request,
  res: Response<CommonResponse, { user: User }>
) {
  const { refreshToken } = req.cookies as { refreshToken: string | undefined };
  const user = res.locals.user;

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(user, refreshToken);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    message: 'Successfully refresh access token'
  });
}

async function revokeRefreshToken(req: Request, res: Response<CommonResponse>) {
  const { refreshToken } = req.cookies as { refreshToken: string | undefined };

  await authService.revokeRefreshToken(refreshToken);

  res.clearCookie('refreshToken');

  res.clearCookie('accessToken');

  res.status(200).json({
    message: 'Successfully revoke refresh token'
  });
}

export const authController = {
  register,
  login,
  refreshAccessToken,
  revokeRefreshToken
};
