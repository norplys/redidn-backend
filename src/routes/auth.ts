import { Router } from 'express';
import { authValidationMiddleware } from '../middlewares/validation/auth.js';
import { userMiddleware } from '../middlewares/user.js';
import { authController } from '../controllers/auth.js';
import { authMiddleware } from '../middlewares/auth.js';

export default function (app: Router) {
    const router = Router();   

    app.use('/auth', router);

    router.post(
        '/register',
        authValidationMiddleware.isValidRegisterPayload,
        userMiddleware.blockIfEmailExist,
        userMiddleware.blockIfUserNameExist,
        authController.register
    );

    router.post(
        '/login',
        authValidationMiddleware.isValidLoginPayload,
        authController.login
    );

    router.post(
        '/refresh',
        authMiddleware.isValidAccessToken,
        authController.refreshAccessToken
    );

}