import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  tags: string[];
  isPinned: boolean;
  isEdited: boolean;
  editHistory: Array<{
    content: string;
    editedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    tags: [
      {
        type: String,
        maxlength: 50,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [
      {
        content: {
          type: String,
          required: true,
        },
        editedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
postSchema.index({ communityId: 1, createdAt: -1 });
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

export default mongoose.model<IPost>("Post", postSchema);
