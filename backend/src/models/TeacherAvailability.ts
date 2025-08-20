import mongoose, { Document, Schema } from "mongoose";

export interface ITimeSlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // Format: "HH:MM" (24-hour)
  endTime: string; // Format: "HH:MM" (24-hour)
  isAvailable: boolean;
}

export interface ITeacherAvailability extends Document {
  mentorId: mongoose.Types.ObjectId;
  timezone: string;
  weeklySchedule: ITimeSlot[];
  customDates: Array<{
    date: Date;
    isAvailable: boolean;
    startTime?: string;
    endTime?: string;
    notes?: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const customDateSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  startTime: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  endTime: {
    type: String,
    match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  },
  notes: {
    type: String,
    maxlength: 200,
  },
});

const teacherAvailabilitySchema = new Schema<ITeacherAvailability>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
      unique: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "UTC",
    },
    weeklySchedule: [timeSlotSchema],
    customDates: [customDateSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITeacherAvailability>(
  "TeacherAvailability",
  teacherAvailabilitySchema
);
