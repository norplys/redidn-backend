import { Router } from 'express';
import { authValidationMiddleware } from '../middlewares/validation/auth.js';
import { userMiddleware } from '../middlewares/user.js';
import { authController } from '../controllers/auth.js';

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
}