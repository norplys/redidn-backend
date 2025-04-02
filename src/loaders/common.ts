import { json } from 'express';
import cookieParser from 'cookie-parser';
import type { Application } from 'express';

export default function (app: Application): void {
  app.use(json());
  app.use(cookieParser());
}