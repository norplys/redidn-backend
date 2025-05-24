import { Router, type Application } from 'express';
import auth from './auth.js';
import root from './root.js';
import communities from './communities.js';
import posts from './posts.js';

export default function (app: Application) {
  const router = Router();

  app.use('/v1', router);

  root(router);

  auth(router);
  communities(router);
  posts(router);
}
