import type { Response } from 'express';

interface SuccessResponse<T> {
    success: true;
    message: string;
    timestamp: string;
    data?: T;
}

interface ErrorResponse {
    success: false;
    message: string;
    timestamp: string;
    errors?: unknown;
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
    res: Response,
    data: T | null = null,
    message= 'Request successful',
    statusCode = 200,
): Response<SuccessResponse<T>> => {
    const response: SuccessResponse<T> = {
        success: true,
        message,
        timestamp: new Date().toISOString(),
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};
  
  /**
   * Send created response (201)
   */
  export const sendCreated = <T>(
    res: Response,
    data: T | null = null,
    message= 'Resource created successfully',
  ): Response<SuccessResponse<T>> => {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
  
    if (data !== null) {
      response.data = data;
    }
  
    return res.status(201).json(response);
  }
  
  /**
   * Send no content response (204)
   */
  export const sendNoContent = (res: Response, message= "No content") => {
    const response: SuccessResponse<null> = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
  
    return res.status(204).json(response);
  }
  
  /**
   * Send error response
   */
  export const sendError = (
    res: Response,
    message = 'Internal server error',
    statusCode = 500,
    errors?: unknown,
  ): Response<ErrorResponse> => {
    const response: ErrorResponse = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
  
    if (errors !== undefined) {
      response.errors = errors;
    }
  
    return res.status(statusCode).json(response);
  }
  
  
  export default {
    sendSuccess,
    sendCreated,
    sendNoContent,
    sendError,

  };