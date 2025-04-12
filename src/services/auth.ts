import jwt, { type JwtPayload } from 'jsonwebtoken';
import { appEnv } from '../utils/env.js';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/db.js';
import type { ValidLoginSchema } from '../middlewares/validation/auth.js';
import { HttpError } from '../utils/error.js';
import type { User } from '@prisma/client';

type Expired = '1d' | '1m' | '30d';

type LoginReturn = {
  accessToken: string;
  refreshToken: string;
};

async function login(payload: ValidLoginSchema): Promise<LoginReturn> {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new HttpError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new HttpError('Invalid email or password', 401);
  }

  const refreshToken = randomUUID();

  const refreshTokenExpired = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  const accessToken = signJwt(user.id, '1d');

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      refreshToken,
      expiredAt: refreshTokenExpired
    }
  });

  return {
    accessToken,
    refreshToken
  };
}

function signJwt(id: string, expired: Expired): string {
  const token = jwt.sign({ id }, appEnv.SECRET_KEY, {
    expiresIn: expired
  });

  return token;
}

async function verifyToken(token: string): Promise<User> {
  try {
    const { id } = verifyJwt(token) as JwtPayload & {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      throw new HttpError('Invalid token', 401);
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Error while verifying token', 401);
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new HttpError('Token expired', 401);
    }

    throw new HttpError('Invalid token', 401);
  }
}

async function verifyTokenIgnoreExpiration(token: string): Promise<User> {
  try {
    const { id } = verifyJwt(token, true) as JwtPayload & {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!user) {
      throw new HttpError('Invalid token', 401);
    }

    return user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError('Error while verifying token', 401);
    }

    if (error instanceof jwt.TokenExpiredError) {
      throw new HttpError('Token expired', 401);
    }

    throw new HttpError('Invalid token', 401);
  }
}

function verifyJwt(
  token: string,
  ignoreExpiration: boolean = false
): string | JwtPayload {
  const payload = jwt.verify(token, appEnv.SECRET_KEY, {
    ignoreExpiration
  });

  return payload;
}

async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  return isMatch;
}

async function refreshAccessToken(
  user: User,
  refreshToken: string | undefined
) {
  if (!refreshToken) {
    throw new HttpError('Missing refresh token', 401);
  }

  const refreshTokenExist = await prisma.refreshToken.findUnique({
    where: {
      refreshToken,
      userId: user.id,
      expiredAt: {
        gte: new Date()
      }
    }
  });

  if (!refreshTokenExist) {
    throw new HttpError('Invalid refresh token', 401);
  }

  const newRefreshToken = randomUUID();
  const refreshTokenExpired = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      refreshToken: newRefreshToken,
      expiredAt: refreshTokenExpired
    }
  });

  const newAccessToken = signJwt(user.id, '1d');

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

async function revokeRefreshToken(
  refreshToken: string | undefined
): Promise<void> {

  if (!refreshToken) {
    throw new HttpError('Missing refresh token', 401);
  }

  const refreshTokenExist = await prisma.refreshToken.findUnique({
    where: {
      refreshToken
    }
  });

  if (!refreshTokenExist) {
    throw new HttpError('Invalid refresh token', 401);
  }

  await prisma.refreshToken.delete({
    where: {
      refreshToken
    }
  });
}

export const authService = {
  signJwt,
  verifyJwt,
  verifyTokenIgnoreExpiration,
  verifyToken,
  hashPassword,
  comparePassword,
  login,
  refreshAccessToken,
  revokeRefreshToken
};
