import jwt, { type JwtPayload } from 'jsonwebtoken';
import { appEnv } from '../utils/env.js';
import bcrypt from 'bcrypt';

enum expired {
  '1d',
  '1m'
}

function signJwt(payload: string, expired: expired): string {
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
  comparePassword
};
