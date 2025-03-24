import { pino } from 'pino';
import { pinoHttp as PinoHttp } from 'pino-http';
// import type { LoggerOptions } from 'pino';
import type { Application } from 'express';

export const logger = pino({
    level: 'info'
});

const pinoHttp = PinoHttp({
    logger
});

export default function (app: Application): void {
    app.use(pinoHttp);
}