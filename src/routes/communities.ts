import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { communityValidationMiddleware } from '../middlewares/validation/communities.js';
import { communityMiddleware } from '../middlewares/community.js';
import { communityController } from '../controllers/community.js';

export default function (app: Router) {
  const router = Router();

  app.use('/communities', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    communityValidationMiddleware.isValidCreateCommunityPayload,
    communityMiddleware.blockIfCommunityNameExists,
    communityController.createCommunity

  );
}
