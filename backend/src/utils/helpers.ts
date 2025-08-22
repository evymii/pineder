import { Response } from "express";
import { logger } from "./logger";
import { ApiResponse, createSuccessResponse, createErrorResponse } from "../types/common";

// Response formatting utilities
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  status = 200
) => {
  const response: ApiResponse<T> = createSuccessResponse(data, message, status);
  res.status(status).json(response);
};

export const sendError = (res: Response, error: string, status = 500) => {
  const response = createErrorResponse(error);
  res.status(status).json(response);
};

export const sendNotFound = (res: Response, resource = "Resource") => {
  return sendError(res, `${resource} not found`, 404);
};

export const sendUnauthorized = (res: Response, message = "Unauthorized") => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message = "Forbidden") => {
  return sendError(res, message, 403);
};

// Pagination utilities
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationOptions = (
  page: string | number | undefined,
  limit: string | number | undefined
): PaginationOptions => {
  const pageNum = parseInt(String(page)) || 1;
  const limitNum = parseInt(String(limit)) || 10;
  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// String utilities
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Array utilities
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// Object utilities
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

// Async error handler
export const asyncHandler = (fn: Function) => {
  return (req: unknown, res: Response, next: unknown) => {
    Promise.resolve(fn(req, res, next)).catch(next as any);
  };
};

// Performance measurement
export const measureTime = async <T>(
  fn: () => Promise<T>,
  operation: string
): Promise<T> => {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.debug(`${operation} completed`, { duration });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`${operation} failed`, { duration, error });
    throw error;
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateRandomId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
