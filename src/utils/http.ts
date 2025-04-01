import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '@modules/logger';

export function routeNotFound(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = StatusCodes.NOT_FOUND;
  const error = { name: 'RouteNotFound', message: `Route not found` };

  logger.error(error, `[${req.method}] ${req.originalUrl} - [${status}]`);

  res.status(status).send(error);

  next();
}

export function errorHandler(
  req: Request,
  res: Response,
  status = StatusCodes.INTERNAL_SERVER_ERROR,
  err: Error
): void {
  const error = { name: err.name, message: err.message };
  logger.error(error, `[${req.method}] ${req.originalUrl} - [${status}]`);

  res.status(status).send(error);
}
