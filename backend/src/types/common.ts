import { Response } from "express";

// Common response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error handling types
export interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

// Success response helper
export const createSuccessResponse = <T>(
  data?: T,
  message?: string,
  status = 200
): ApiResponse<T> => {
  const response: ApiResponse<T> = { success: true };
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  return response;
};

// Error response helper
export const createErrorResponse = (
  error: string,
  details?: unknown
): ErrorResponse => ({
  success: false,
  error,
  details,
});

// Availability types
export interface TimeSlot {
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface MentorAvailability {
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

// Session types
export interface SessionRescheduleRequest {
  requestedBy: string;
  requestedAt: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface SessionRescheduleHistory {
  requestedBy: string;
  requestedAt: Date;
  oldStartTime: Date;
  oldEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status: "approved" | "rejected";
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

// Event types
export interface EventFilters {
  category?: string;
  eventType?: string;
  locationType?: string;
  startDate?: string;
  endDate?: string;
}

// Topic types
export interface TopicFilters {
  category?: string;
  week?: number;
  year?: number;
}

// User profile update types
export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

export interface StudentProfileUpdate {
  grade?: string;
  subjects?: string[];
  interests?: string[];
  goals?: string[];
}

export interface MentorProfileUpdate {
  specialties?: string[];
  bio?: string;
  hourlyRate?: number;
  subjects?: string[];
  availability?: MentorAvailability[];
}

// Logger types
export interface LogMeta {
  userId?: string;
  action?: string;
  resource?: string;
  timestamp?: Date;
  [key: string]: unknown;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationErrorResponse {
  success: false;
  error: "Validation failed";
  details: ValidationError[];
}
