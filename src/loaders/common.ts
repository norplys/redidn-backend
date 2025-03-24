import { json } from 'express';
import type { Application } from 'express';

export default function (app: Application): void {
  app.use(json());
}