import { Router, type Application } from 'express';
import auth from './auth.js';
import root from './root.js';

export default function (app: Application) {
  const router = Router();

  app.use('/v1', router);

  root(router);

  auth(router);
}
