import mongoose, { Document, Schema } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  description: string;
  category: string;
  members: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  rules: string[];
  isPrivate: boolean;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

const communitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    rules: [
      {
        type: String,
        maxlength: 200,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxMembers: {
      type: Number,
      default: 1000,
      min: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
communitySchema.index({ category: 1 });
communitySchema.index({ isPrivate: 1 });

export default mongoose.model<ICommunity>("Community", communitySchema);
