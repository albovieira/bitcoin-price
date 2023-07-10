/* eslint-disable consistent-return */
import * as express from 'express';

import { NotAuthorizedError } from '../exceptions';
import { logger } from '../utils';

const errorHandler = (
  err: Error,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const errors = {
    NOT_AUTHORIZED: () => {
      logger.error(err.message);
      return res.status(401).json({
        message: err.message,
        details: (err as any).details,
      });
    },
    ValidationError: () => {
      logger.warn(err.message);
      return res.status(422).json({
        message: err.message,
        details: (err as any).details,
      });
    },
    NOT_FOUND: () => {
      logger.warn(err.message);
      return res.status(404).json({
        message: err.message,
        details: (err as any).details,
      });
    },
    BAD_REQUEST: () => {
      logger.error(err.message);
      return res.status(400).json({
        message: err.message,
        details: (err as any).details,
      });
    },
    PAYMENT_REQUIRED: () => {
      logger.error(err.message);
      return res.status(402).json({
        message: err.message,
        details: (err as any).details,
      });
    },
  };

  if (['AuthorizationError'].includes(err.name)) {
    err = new NotAuthorizedError();
  }

  const errorFN = errors[err.name as keyof Object];
  if (errorFN) {
    return errorFN(1);
  }

  logger.error(err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    details: err.message,
  });
  next();
};

export default errorHandler;
