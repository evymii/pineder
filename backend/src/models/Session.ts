import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  title: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status:
    | "requested"
    | "approved"
    | "rejected"
    | "scheduled"
    | "active"
    | "completed"
    | "cancelled"
    | "rescheduled";
  subject: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  meetingLink?: string;
  recordingUrl?: string;
  materials?: string[];
  price: number;
  currency: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  requestNotes?: string;
  rejectionReason?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "requested",
        "approved",
        "rejected",
        "scheduled",
        "active",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      default: "requested",
    },
    subject: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      maxlength: 1000,
    },
    meetingLink: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    materials: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    requestNotes: {
      type: String,
      maxlength: 500,
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
sessionSchema.index({ mentorId: 1, startTime: 1 });
sessionSchema.index({ studentId: 1, startTime: 1 });
sessionSchema.index({ status: 1, startTime: 1 });

export default mongoose.model<ISession>("Session", sessionSchema);
