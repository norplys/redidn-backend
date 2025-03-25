import { HttpError } from '../utils/error.js';
import type { Application, Request, Response, NextFunction } from 'express';

export default (app: Application): void => {
  app.use(notFound);
  app.use(errorHandler);
};

function notFound(req: Request, _res: Response, next: NextFunction): void {
  const notFoundError = new HttpError(
    `Route not found - ${req.originalUrl}`,
    404
  );

  next(notFoundError);
}

function errorHandler(
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message
    });

    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      message: err.message
    });

    return;
  }

  res.status(500).json({
    message: 'Something went wrong'
  });
}
