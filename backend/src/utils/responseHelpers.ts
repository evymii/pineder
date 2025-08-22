import { Response } from "express";

// Shared response helpers to eliminate repetition
export const sendSuccess = (res: Response, data?: any, message?: string, status = 200) => {
  const response: any = { success: true };
  if (data) response.data = data;
  if (message) response.message = message;
  res.status(status).json(response);
};

export const sendError = (res: Response, message: string, status = 500) => {
  res.status(status).json({ success: false, error: message });
};

export const sendUnauthorized = (res: Response) => {
  sendError(res, "Authentication required", 401);
};

export const sendForbidden = (res: Response) => {
  sendError(res, "Access denied", 403);
};

export const sendNotFound = (res: Response, resource: string) => {
  sendError(res, `${resource} not found`, 404);
};

export const sendBadRequest = (res: Response, message: string) => {
  sendError(res, message, 400);
};

// Validation helpers
export const validateRequiredFields = (body: any, fields: string[]): string | null => {
  for (const field of fields) {
    if (!body[field]) {
      return `${field} is required`;
    }
  }
  return null;
};

// Role validation
export const validateRole = (userRole: string, requiredRole: string): boolean => {
  return userRole === requiredRole;
};
