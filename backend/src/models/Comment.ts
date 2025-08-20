import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  authorId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  parentCommentId?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  isEdited: boolean;
  editHistory: Array<{
    content: string;
    editedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ authorId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });

export default mongoose.model<IComment>("Comment", commentSchema);
