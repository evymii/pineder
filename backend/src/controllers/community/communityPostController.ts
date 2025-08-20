import { Request, Response } from "express";
import mongoose from "mongoose";
import Community from "../../models/Community";
import Post from "../../models/Post";
import User from "../../models/User";

// Get all posts in a community
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    const posts = await Post.find({ communityId })
      .populate("authorId", "firstName lastName avatar")
      .populate("comments")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ communityId });

    res.json({
      success: true,
      data: posts,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ success: false, error: "Failed to fetch posts" });
  }
};

// Create new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const postData = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        error: "Community not found",
      });
    }

    const post = await Post.create({
      ...postData,
      communityId,
      likes: [],
      comments: [],
    });

    community.posts.push(post._id as mongoose.Types.ObjectId);
    await community.save();

    const populatedPost = await Post.findById(post._id)
      .populate("authorId", "firstName lastName avatar")
      .populate("comments");

    res.status(201).json({
      success: true,
      data: populatedPost,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, error: "Failed to create post" });
  }
};

// Get single post
export const getPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("authorId", "firstName lastName avatar")
      .populate({
        path: "comments",
        populate: {
          path: "authorId",
          select: "firstName lastName avatar",
        },
      });

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ success: false, error: "Failed to fetch post" });
  }
};

// Update post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const updates = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, {
      new: true,
      runValidators: true,
    })
      .populate("authorId", "firstName lastName avatar")
      .populate("comments");

    res.json({
      success: true,
      data: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, error: "Failed to update post" });
  }
};

// Delete post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { communityId, postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);

    // Remove post from community
    const community = await Community.findById(communityId);
    if (community) {
      community.posts = community.posts.filter(
        (id) => id.toString() !== postId
      );
      await community.save();
    }

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, error: "Failed to delete post" });
  }
};

// Like/Unlike post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      data: {
        isLiked: !isLiked,
        likesCount: post.likes.length,
      },
      message: isLiked ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ success: false, error: "Failed to like post" });
  }
};
