import jwt, { type JwtPayload } from 'jsonwebtoken';
import { appEnv } from '../utils/env.js';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/db.js';
import type { ValidLoginSchema } from '../middlewares/validation/auth.js';
import { HttpError } from '../utils/error.js';

type Expired = '1d' | '1m' | '30d';

type LoginReturn = {
  accessToken: string;
  refreshToken: string;
}

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

  const refreshToken = signJwt(user.id, '30d');

  const accessToken = signJwt(user.id, '1d');

 await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken
    }
  });

  return {
    accessToken,
    refreshToken
  };
}

function signJwt(payload: string, expired: Expired): string {
  const token = jwt.sign({ payload }, appEnv.SECRET_KEY, {
    expiresIn: expired
  });

  return token;
}

function verifyJwt(token: string): string | JwtPayload {
  const payload = jwt.verify(token, appEnv.SECRET_KEY);

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
 
export const authService = {
  signJwt,
  verifyJwt,
  hashPassword,
  comparePassword,
  login
};
