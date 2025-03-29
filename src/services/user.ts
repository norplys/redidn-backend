import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { authService } from './auth.js';
import type { ValidRegisterSchema } from '../middlewares/validation/auth.js';

async function blockIfEmailExists(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (user) {
    throw new HttpError('Email already exists', 409);
  }
}

async function blockIfUserNameExists(username: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (user) {
    throw new HttpError('Username already exists', 409);
  }
}

async function createUser(
  payload: ValidRegisterSchema
){
  const password = await authService.hashPassword(payload.password);

  const user =  await prisma.user.create({
    data: {
      ...payload,
      password
    }
  });

  return user;
}

export const userService = {
  blockIfEmailExists,
  blockIfUserNameExists,
  createUser
};