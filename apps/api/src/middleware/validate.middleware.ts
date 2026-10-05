import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/error-code.js';

export const validate = (
  schema: ZodType,
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        'Validation failed',
        400,
        ERROR_CODES.VALIDATION_ERROR,
      );
    }

    req.body = result.data;

    next();
  };
};