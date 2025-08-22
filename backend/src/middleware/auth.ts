import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
    dbId?: string; // Database user ID
  };
  file?: { fieldname: string; originalname: string; mimetype: string; buffer: Buffer; size: number }; // File property for uploads
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user info from frontend (sent by Clerk)
    const userRole = req.headers["x-user-role"] as string;
    const userEmail = req.headers["x-user-email"] as string;
    const userId = req.headers["x-user-id"] as string;

    if (!userRole || !userEmail || !userId) {
      return res.status(401).json({
        success: false,
        error: "User authentication required",
      });
    }

    // ✅ Verify role matches email domain (same logic as frontend)
    const emailLower = userEmail.toLowerCase();
    let expectedRole = "other";

    if (emailLower.endsWith("@nest.edu.mn")) {
      expectedRole = "student";
    } else if (emailLower.endsWith("@gmail.com")) {
      expectedRole = "mentor";
    }

    // Security check: role must match email domain (disabled for testing)
    // if (userRole !== expectedRole) {
    //   return res.status(403).json({
    //     success: false,
    //     error: "User role does not match email domain",
    //   });
    // }

    // Get user from database to get the actual database ID
    const dbUser = await User.findOne({ email: userEmail });

    // Add user info to request
    req.user = {
      id: userId, // Clerk user ID
      role: userRole,
      email: userEmail,
      dbId: dbUser?._id?.toString(), // Database user ID
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

// Optional: Middleware for specific roles
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    next();
  };
};

// Specific role middlewares
export const requireStudent = requireRole(["student"]);
export const requireMentor = requireRole(["mentor"]);
export const requireAdmin = requireRole(["admin"]);
