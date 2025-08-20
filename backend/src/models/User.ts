import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  avatarPublicId?: string; // Cloudinary public ID for avatar management
  bio?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: Date;
  profileCompleted: boolean;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
    },
    avatarPublicId: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    location: {
      type: String,
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      emailUpdates: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: "en",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
