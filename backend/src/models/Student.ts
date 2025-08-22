import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  grade: string;
  subjects: string[];
  goals: string[];
  totalSessions: number;
  totalMentors: number;
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
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    subjects: [
      {
        type: String,
        required: false,
      },
    ],
    goals: [
      {
        type: String,
        maxlength: 200,
      },
    ],
    totalSessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalMentors: {
      type: Number,
      default: 0,
      min: 0,
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
