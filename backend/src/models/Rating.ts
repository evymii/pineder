import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  sessionId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one rating per session per student
ratingSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

// Index for calculating mentor average ratings
ratingSchema.index({ mentorId: 1, rating: 1 });

export default mongoose.model<IRating>("Rating", ratingSchema);
