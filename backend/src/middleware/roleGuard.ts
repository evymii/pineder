import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { sendForbidden } from "../utils/responseHelpers";

export const requireRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendForbidden(res);
    }

    if (req.user.role !== requiredRole) {
      return sendForbidden(res);
    }

    next();
  };
};

export const requireStudent = requireRole("student");
export const requireMentor = requireRole("mentor");
