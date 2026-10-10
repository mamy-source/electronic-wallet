import type { NextFunction, Request, Response } from 'express';
import {prisma} from '../../config/prisma.js';

import { verifyAccessToken } from '../../libs/jwt.lib.js';
import { sendError } from '../../utils/response.js';

import type { Role } from '../../generated/prisma/client.js';

/**
 * Middleware to protect routes.
 * Requires a valid access token and an existing user.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      sendError(
        res,
        'You are not logged in. Please login.',
        401,
      );
      return;
    }

    // Verify access token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      sendError(
        res,
        'Invalid or expired token. Please login again.',
        401,
      );
      return;
    }

    // Check if user still exists in database
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            bio: true,
          },
        },
      },
    });

    if (!user) {
      sendError(
        res,
        'User does not exist.',
        401,
      );
      return;
    }

    // Attach authenticated user to request
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    sendError(
      res,
      'Authentication error.',
      500,
    );
  }
};

//Middleware to restrict access based on roles.

export const restrictTo =
  (...roles: Role[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      sendError(
        res,
        'Access denied.',
        401,
      );
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        'Access denied for this resource.',
        403,
      );
      return;
    }

    next();
  };

//Optional authentication middleware.

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      next();
      return;
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      next();
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            bio: true,
          },
        },
      },
    });

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    console.error(
      'Optional auth middleware error:',
      error,
    );

    // Optional auth must not block the request.
    next();
  }
};

export default {
  protect,
  restrictTo,
  optionalAuth,
};