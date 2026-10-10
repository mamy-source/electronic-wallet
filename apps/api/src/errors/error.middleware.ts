import type {
    ErrorRequestHandler,
    Request,
    Response,
    NextFunction,
  } from 'express';
  
  import { AppError } from './app-error.js';
  import { ERROR_CODES } from './error-code.js';
  
  const errorMiddleware: ErrorRequestHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
  
      return;
    }
  
    console.error('Unhandled error:', error);
  
    res.status(500).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      },
    });
  };
  
  export default errorMiddleware;