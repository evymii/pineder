import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../../models/Post";
import Comment from "../../models/Comment";
import User from "../../models/User";

// Add comment to post
export const addComment = async (req: Request, res: Response) => {
  try {
    const { communityId, postId } = req.params;
    const commentData = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const user = await User.findById(commentData.authorId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const comment = new Comment({
      ...commentData,
      postId,
    });

    await comment.save();

    post.comments.push(comment._id as mongoose.Types.ObjectId);
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      "authorId",
      "firstName lastName avatar"
    );

    res.status(201).json({
      success: true,
      data: populatedComment,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add comment",
    });
  }
};

// Update comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { communityId, postId, commentId } = req.params;
    const updates = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    if (comment.authorId.toString() !== updates.authorId) {
      return res.status(403).json({
        success: false,
        error: "Can only update your own comments",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, updates, {
      new: true,
      runValidators: true,
    }).populate("authorId", "firstName lastName avatar");

    res.json({
      success: true,
      data: updatedComment,
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update comment",
    });
  }
};

// Delete comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { communityId, postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      });
    }

    if (comment.authorId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Can only delete your own comments",
      });
    }

    await Comment.findByIdAndDelete(commentId);

    post.comments = post.comments.filter((id) => id.toString() !== commentId);
    await post.save();

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete comment",
    });
  }
};
