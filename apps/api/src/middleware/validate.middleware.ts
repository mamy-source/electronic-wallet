import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/app-error.js';

export const validate = (
  schema: ZodType,
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        'Validation failed',
        400,
        true,
        result.error.flatten().fieldErrors,
      );
    }

    req.body = result.data;

    next();
  };
};