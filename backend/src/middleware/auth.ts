import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Basic authentication logic can be added here
  console.log('Auth middleware executed');
  next();
}; 