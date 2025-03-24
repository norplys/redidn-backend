import common from './common.js';
import pino from './pino.js';
import type { Application } from 'express';

export default function (app: Application): void {
    common(app);
    pino(app);
}
