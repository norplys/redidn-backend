import { userService } from '../services/user.js';
import { authService } from '../services/auth.js';
import type { ValidLoginSchema, ValidRegisterSchema } from '../middlewares/validation/auth.js';
import type { Request, Response } from 'express';
import type { CommonResponse } from '../utils/types/express.js';

async function register(
    req: Request<unknown, unknown, ValidRegisterSchema>,
    res: Response<CommonResponse>
){
    const body = req.body;

    await userService.createUser(body);

    res.status(201).json({
        message: 'Successfully register user'
    });
}

async function login(
    req: Request<unknown, unknown, ValidLoginSchema>,
    res: Response<CommonResponse>
){
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

export const authController = {
    register,
    login
};
