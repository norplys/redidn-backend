import { userService } from '../services/user.js';
import type { ValidRegisterSchema } from '../middlewares/validation/auth.js';
import type { Request, Response } from 'express';
import type { CommonResponse } from '../utils/types/express.js';

async function register(
    req: Request<unknown, unknown, ValidRegisterSchema>,
    res: Response<CommonResponse>
){
    const body = req.body;

    await userService.createUser(body);

    res.status(201).json({
        message: 'Successfully create user'
    });

    
}

export const authController = {
    register
};
