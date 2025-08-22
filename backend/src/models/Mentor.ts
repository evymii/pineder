import mongoose, { Document, Schema } from "mongoose";

export interface IMentor extends Document {
  userId: mongoose.Types.ObjectId;
  specialties: string[];
  bio: string;
  experience: number;
  rating: number;
  hourlyRate: number;
  mentorType: string;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  subjects: string[];
  education: string[];
  certifications: string[];
  languages: string[];
  timezone: string;
  isVerified: boolean;
  totalSessions: number;
  totalStudents: number;
  createdAt: Date;
  updatedAt: Date;
}

const mentorSchema = new Schema<IMentor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialties: [
      {
        type: String,
        required: false, // Temporarily changed for debugging
      },
    ],
    bio: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    mentorType: {
      type: String,
      required: false,
      default: "Software Engineer",
    },
    availability: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
          min: 0,
          max: 6,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    subjects: [
      {
        type: String,
        required: false, // Temporarily changed for debugging
      },
    ],
    education: [
      {
        type: String,
      },
    ],
    certifications: [
      {
        type: String,
      },
    ],
    languages: [
      {
        type: String,
      },
    ],
    timezone: {
      type: String,
      default: "UTC",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMentor>("Mentor", mentorSchema);
