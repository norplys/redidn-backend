import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { postValidationMiddleware } from '../middlewares/validation/posts.js';
import { postController } from '../controllers/post.js';

export default function (app: Router) {
  const router = Router();

  app.use('/posts', router);

  router.post(
    '/',
    authMiddleware.isAuthorized,
    postValidationMiddleware.isValidCreatePostPayload,
    postController.createPostController
  );
}
