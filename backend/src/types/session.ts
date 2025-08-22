import mongoose from "mongoose";

// Base session interface
export interface ISession extends mongoose.Document {
  title: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
  subject: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  recordingUrl?: string;
  materials?: string[];
  studentChoice: StudentChoice;
  paymentStatus: PaymentStatus;
  requestNotes?: string;
  rejectionReason?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  completedAt?: Date;
  zoomMeetingId?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  zoomPassword?: string;
  teamsChatUrl?: string;
  meetingProvider: MeetingProvider;
  rescheduleRequest?: IRescheduleRequest;
  rescheduleHistory?: IRescheduleHistory[];
  createdAt: Date;
  updatedAt: Date;
}

// Session status enum
export type SessionStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled"
  | "rescheduled"
  | "reschedule_requested";

export const SessionStatusValues = [
  "requested",
  "approved",
  "rejected",
  "scheduled",
  "active",
  "completed",
  "cancelled",
  "rescheduled",
  "reschedule_requested",
] as const;

// Student choice enum
export type StudentChoice = "free" | "coffee" | "ice-cream";

export const StudentChoiceValues = ["free", "coffee", "ice-cream"] as const;

// Payment status enum
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export const PaymentStatusValues = ["pending", "completed", "failed", "refunded"] as const;

// Meeting provider enum
export type MeetingProvider = "zoom" | "google-meet" | "teams" | "simple";

export const MeetingProviderValues = ["zoom", "google-meet", "teams", "simple"] as const;

// Reschedule request interface
export interface IRescheduleRequest {
  requestedBy: mongoose.Types.ObjectId;
  requestedAt: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status?: "pending" | "approved" | "rejected";
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

// Reschedule history interface
export interface IRescheduleHistory {
  requestedBy: mongoose.Types.ObjectId;
  requestedAt: Date;
  oldStartTime: Date;
  oldEndTime: Date;
  newStartTime: Date;
  newEndTime: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}
