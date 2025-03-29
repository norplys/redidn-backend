import type { Request, Response, NextFunction } from 'express';
import type { CommonResponse } from '../utils/types/express.js';
import type { ValidRegisterSchema } from './validation/auth.js';
import { userService } from '../services/user.js';

async function blockIfEmailExist(
    req: Request<unknown, unknown, ValidRegisterSchema>,
    _res: Response<CommonResponse>,
    next: NextFunction
  ) {
    const { email } = req.body;

    await userService.blockIfEmailExists(email);
  
    next();
}

async function blockIfUserNameExist(
    req: Request<unknown, unknown, ValidRegisterSchema>,
    _res: Response<CommonResponse>,
    next: NextFunction
  ) {
    const { username } = req.body;

    await userService.blockIfUserNameExists(username);
  
    next();
}


  export const userMiddleware = {
    blockIfEmailExist,
    blockIfUserNameExist
  };