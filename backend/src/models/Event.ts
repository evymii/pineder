import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  mentorId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  location: string;
  locationType: "online" | "in-person" | "hybrid";
  maxParticipants?: number;
  currentParticipants: number;
  price: number;
  currency: string;
  category: string;
  eventType:
    | "workshop"
    | "discussion"
    | "seminar"
    | "meetup"
    | "webinar"
    | "q&a";
  tags: string[];
  isPublic: boolean;
  status: "draft" | "published" | "cancelled" | "completed";
  participants: mongoose.Types.ObjectId[];
  registeredStudents: mongoose.Types.ObjectId[];
  eventId: string; // Auto-generated event ID like #0004
  meetingLink?: string;
  materials?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
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
    location: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },
    locationType: {
      type: String,
      enum: ["online", "in-person", "hybrid"],
      default: "online",
    },
    maxParticipants: {
      type: Number,
      min: 1,
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Database",
        "Cloud Computing",
        "Cybersecurity",
        "UI/UX Design",
        "Architecture",
        "General Programming",
        "Other",
      ],
    },
    eventType: {
      type: String,
      enum: ["workshop", "discussion", "seminar", "meetup", "webinar", "q&a"],
      default: "discussion",
    },
    tags: [
      {
        type: String,
        maxlength: 50,
        trim: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    registeredStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    eventId: {
      type: String,
      required: false,
    },
    meetingLink: {
      type: String,
    },
    materials: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate event ID
eventSchema.pre("save", async function (next) {
  if (this.isNew && !this.eventId) {
    const count = await mongoose.model("Event").countDocuments();
    this.eventId = `#${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Indexes for better query performance
eventSchema.index({ mentorId: 1, startTime: 1 });
eventSchema.index({ status: 1, startTime: 1 });
eventSchema.index({ category: 1, isPublic: 1 });
eventSchema.index({ eventId: 1 });
eventSchema.index({ startTime: 1, endTime: 1 });

export default mongoose.model<IEvent>("Event", eventSchema);
