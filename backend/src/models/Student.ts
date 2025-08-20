import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  grade: string;
  subjects: string[];
  goals: string[];
  learningStyle: string;
  timezone: string;
  parentEmail?: string;
  totalSessions: number;
  totalHours: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    grade: {
      type: String,
      required: true,
    },
    subjects: [
      {
        type: String,
        required: true,
      },
    ],
    goals: [
      {
        type: String,
        maxlength: 200,
      },
    ],
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "kinesthetic", "reading", "mixed"],
      default: "mixed",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    parentEmail: {
      type: String,
      required: false,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStudent>("Student", studentSchema);
