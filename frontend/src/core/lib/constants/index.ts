// Application constants
export const APP_NAME = "Pineder";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION =
  "Educational platform connecting students with mentors";

// API constants
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_ATTEMPTS = 3;

// Authentication constants
export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";
export const AUTH_USER_KEY = "auth_user";
export const AUTH_EXPIRY_KEY = "auth_expiry";

// User roles
export const USER_ROLES = {
  STUDENT: "student",
  MENTOR: "mentor",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Session statuses
export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  RESCHEDULED: "rescheduled",
} as const;

export type SessionStatus =
  (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

// Group session statuses
export const GROUP_SESSION_STATUS = {
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type GroupSessionStatus =
  (typeof GROUP_SESSION_STATUS)[keyof typeof GROUP_SESSION_STATUS];

// Topic statuses
export const TOPIC_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type TopicStatus = (typeof TOPIC_STATUS)[keyof typeof TOPIC_STATUS];

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Subjects
export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Literature",
  "Art",
  "Music",
  "Physical Education",
  "Economics",
  "Psychology",
  "Philosophy",
  "Languages",
  "Engineering",
  "Medicine",
  "Law",
] as const;

export type Subject = (typeof SUBJECTS)[number];

// Grade levels
export const GRADE_LEVELS = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "College",
  "Graduate School",
  "Adult Learning",
] as const;

export type GradeLevel = (typeof GRADE_LEVELS)[number];

// Experience levels
export const EXPERIENCE_LEVELS = [
  "Beginner (0-2 years)",
  "Intermediate (3-5 years)",
  "Advanced (6-10 years)",
  "Expert (10+ years)",
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

// Time slots (in minutes)
export const TIME_SLOTS = [30, 45, 60, 90, 120] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

// Days of the week
export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Search and filtering
export const DEFAULT_SEARCH_DELAY = 300; // milliseconds
export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_LENGTH = 100;

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

// Rating system
export const MIN_RATING = 1;
export const MAX_RATING = 5;
export const RATING_STEPS = [1, 2, 3, 4, 5];

// Pricing
export const MIN_HOURLY_RATE = 10;
export const MAX_HOURLY_RATE = 500;
export const CURRENCY = "USD";

// Session limits
export const MAX_SESSIONS_PER_DAY = 8;
export const MAX_GROUP_SESSION_SIZE = 20;
export const MIN_SESSION_DURATION = 30; // minutes
export const MAX_SESSION_DURATION = 240; // minutes

// Community
export const MAX_COMMUNITY_MEMBERS = 1000;
export const MAX_POST_LENGTH = 5000;
export const MAX_COMMENT_LENGTH = 1000;

// UI constants
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  TIMEOUT_ERROR: "Request timed out. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  SESSION_BOOKED: "Session booked successfully!",
  SESSION_CANCELLED: "Session cancelled successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
  SETTINGS_SAVED: "Settings saved successfully!",
  FEEDBACK_SUBMITTED: "Feedback submitted successfully!",
  TOPIC_SUBMITTED: "Topic submitted successfully!",
  VOTE_SUBMITTED: "Vote submitted successfully!",
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "theme",
  LANGUAGE: "language",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
  DASHBOARD_LAYOUT: "dashboard_layout",
  RECENT_SEARCHES: "recent_searches",
  FAVORITE_MENTORS: "favorite_mentors",
  SESSION_PREFERENCES: "session_preferences",
};

// Feature flags
export const FEATURE_FLAGS = {
  GROUP_SESSIONS: true,
  COMMUNITY_FEATURES: true,
  ADVANCED_ANALYTICS: false,
  VIDEO_CALLS: false,
  FILE_SHARING: true,
  NOTIFICATIONS: true,
  DARK_MODE: true,
  MULTI_LANGUAGE: false,
};

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
export const IS_TEST = process.env.NODE_ENV === "test";

// Analytics
export const ANALYTICS_EVENTS = {
  SESSION_BOOKED: "session_booked",
  SESSION_COMPLETED: "session_completed",
  MENTOR_VIEWED: "mentor_viewed",
  PROFILE_UPDATED: "profile_updated",
  SEARCH_PERFORMED: "search_performed",
  FEEDBACK_SUBMITTED: "feedback_submitted",
};

// SEO
export const SEO = {
  DEFAULT_TITLE: "Pineder - Connect with Expert Mentors",
  DEFAULT_DESCRIPTION:
    "Find the perfect mentor for your learning journey. Book sessions, join group classes, and accelerate your growth.",
  DEFAULT_KEYWORDS:
    "mentoring, education, learning, tutors, online classes, group sessions",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://pineder.com",
};
