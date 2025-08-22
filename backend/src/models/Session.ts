import mongoose, { Schema } from "mongoose";
import { 
  ISession, 
  SessionStatusValues, 
  StudentChoiceValues, 
  PaymentStatusValues, 
  MeetingProviderValues 
} from "../types/session";

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
      enum: SessionStatusValues,
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

    recordingUrl: {
      type: String,
    },
    materials: [
      {
        type: String,
      },
    ],
    studentChoice: {
      type: String,
      enum: StudentChoiceValues,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: PaymentStatusValues,
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
    completedAt: {
      type: Date,
    },

    // Zoom meeting information
    zoomMeetingId: {
      type: String,
    },
    zoomJoinUrl: {
      type: String,
    },
    zoomStartUrl: {
      type: String,
    },
    zoomPassword: {
      type: String,
    },
    meetingProvider: {
      type: String,
      enum: MeetingProviderValues,
      default: "zoom",
    },

    // Reschedule information
    rescheduleRequest: {
      requestedBy: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      requestedAt: {
        type: Date,
      },
      newStartTime: {
        type: Date,
      },
      newEndTime: {
        type: Date,
      },
      reason: {
        type: String,
        maxlength: 1000,
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      approvedAt: {
        type: Date,
      },
      rejectedAt: {
        type: Date,
      },
      rejectionReason: {
        type: String,
        maxlength: 500,
      },
    },
    rescheduleHistory: [
      {
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: "Student",
        },
        requestedAt: {
          type: Date,
        },
        oldStartTime: {
          type: Date,
        },
        oldEndTime: {
          type: Date,
        },
        newStartTime: {
          type: Date,
        },
        newEndTime: {
          type: Date,
        },
        reason: {
          type: String,
          maxlength: 1000,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        approvedAt: {
          type: Date,
        },
        rejectedAt: {
          type: Date,
        },
        rejectionReason: {
          type: String,
          maxlength: 500,
        },
      },
    ],
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
