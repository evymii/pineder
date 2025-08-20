import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Hash,
  Shield,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  X,
  Plus,
  Send,
  Bookmark,
  Flag,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Badge } from "../../../design/system/badge";
import { useTheme } from "../../../core/contexts/ThemeContext";
import {
  Community,
  CommunityPost,
  CommunityComment,
  getPostsByCommunityId,
  getCommentsByPostId,
  isUserMemberOfCommunity,
} from "../../../core/lib/data/communities";

interface CommunityDetailsProps {
  community: Community;
  isOpen: boolean;
  onClose: () => void;
  onJoinLeave: (communityId: string, action: "join" | "leave") => void;
}

export function CommunityDetails({
  community,
  isOpen,
  onClose,
  onJoinLeave,
}: CommunityDetailsProps) {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "members" | "rules"
  >("overview");
  const [posts, setPosts] = useState<CommunityPost[]>(
    getPostsByCommunityId(community.id)
  );
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isMember, setIsMember] = useState(
    isUserMemberOfCommunity("currentUser", community.id)
  );

  const handleJoinLeave = () => {
    const action = isMember ? "leave" : "join";
    onJoinLeave(community.id, action);
    setIsMember(!isMember);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      communityId: community.id,
      authorId: "currentUser",
      authorName: "Current User",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isPinned: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPostForm(false);
  };

  const handleCreateComment = (postId: string) => {
    if (!newComment.trim()) return;

    const comment: CommunityComment = {
      id: Date.now().toString(),
      postId,
      authorId: "currentUser",
      authorName: "Current User",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: newComment.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update post comment count
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      )
    );

    setNewComment("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-200 overflow-hidden"
          style={{
            backgroundColor: colors.background.modal,
            borderColor: colors.border.primary,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 p-0 z-20 transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: `${colors.accent.primary}10`,
              color: colors.text.primary,
            }}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Header */}
          <div className="relative p-8 pb-4">
            <div className="flex items-start space-x-6">
              {/* Community Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  {community.image ? (
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                      {community.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Community Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h1
                    className="text-3xl font-bold truncate"
                    style={{ color: colors.text.primary }}
                  >
                    {community.name}
                  </h1>
                  <Badge
                    className="px-3 py-1 text-sm font-medium"
                    style={{
                      backgroundColor:
                        community.status === "active"
                          ? `${colors.accent.success}20`
                          : community.status === "growing"
                          ? `${colors.accent.info}20`
                          : `${colors.accent.warning}20`,
                      color:
                        community.status === "active"
                          ? colors.accent.success
                          : community.status === "growing"
                          ? colors.accent.info
                          : colors.accent.warning,
                      borderColor: colors.border.primary,
                    }}
                  >
                    {community.status}
                  </Badge>
                </div>

                <p
                  className="text-lg mb-4"
                  style={{ color: colors.text.secondary }}
                >
                  {community.description}
                </p>

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {community.members.toLocaleString()} members
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hash
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      {community.topics.length} topics
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: colors.text.secondary }}
                    />
                    <span style={{ color: colors.text.secondary }}>
                      Created {formatDate(community.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 space-y-3">
                <Button
                  onClick={handleJoinLeave}
                  className="w-full px-6 py-3 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: isMember
                      ? colors.accent.error
                      : `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
                    color: colors.text.inverse,
                  }}
                >
                  {isMember ? "Leave Community" : "Join Community"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full px-6 py-3 text-lg font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: `${colors.accent.primary}10`,
                  }}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="px-8 border-b"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="flex space-x-8">
              {[
                { key: "overview", label: "Overview", icon: Hash },
                { key: "posts", label: "Posts", icon: MessageCircle },
                { key: "members", label: "Members", icon: Users },
                { key: "rules", label: "Rules", icon: Shield },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-all duration-200 hover:shadow-sm`}
                  style={{
                    borderBottomColor:
                      activeTab === key ? colors.accent.primary : "transparent",
                    color:
                      activeTab === key
                        ? colors.text.primary
                        : colors.text.secondary,
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Topics */}
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Hash
                          className="w-5 h-5"
                          style={{ color: colors.accent.primary }}
                        />
                        <span style={{ color: colors.text.primary }}>
                          Topics & Interests
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {community.topics.map((topic, index) => (
                          <Badge
                            key={index}
                            className="px-3 py-2 text-sm font-medium"
                            style={{
                              backgroundColor: `${colors.accent.primary}20`,
                              color: colors.accent.primary,
                              borderColor: colors.border.primary,
                            }}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Posts */}
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: colors.background.card,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle
                          className="w-5 h-5"
                          style={{ color: colors.accent.primary }}
                        />
                        <span style={{ color: colors.text.primary }}>
                          Recent Posts
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {posts.slice(0, 3).map((post) => (
                          <div
                            key={post.id}
                            className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                            style={{
                              backgroundColor: colors.background.secondary,
                              border: `1px solid ${colors.border.primary}`,
                            }}
                            onClick={() => setSelectedPost(post)}
                          >
                            <h4
                              className="font-semibold mb-2"
                              style={{ color: colors.text.primary }}
                            >
                              {post.title}
                            </h4>
                            <p
                              className="text-sm mb-3 line-clamp-2"
                              style={{ color: colors.text.secondary }}
                            >
                              {post.content}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <span style={{ color: colors.text.tertiary }}>
                                by {post.authorName}
                              </span>
                              <div className="flex items-center space-x-4">
                                <span style={{ color: colors.text.tertiary }}>
                                  {post.likes} likes
                                </span>
                                <span style={{ color: colors.text.tertiary }}>
                                  {post.comments} comments
                                </span>
                                <span style={{ color: colors.text.tertiary }}>
                                  {formatDate(post.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Create Post Button */}
                  <div className="flex justify-between items-center">
                    <h3
                      className="text-xl font-semibold"
                      style={{ color: colors.text.primary }}
                    >
                      Community Posts
                    </h3>
                    <Button
                      onClick={() => setShowNewPostForm(!showNewPostForm)}
                      className="px-6 py-3 hover:shadow-lg transition-all duration-300"
                      style={{
                        backgroundColor: colors.accent.primary,
                        color: colors.text.inverse,
                      }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Post
                    </Button>
                  </div>

                  {/* New Post Form */}
                  {showNewPostForm && (
                    <Card
                      className="overflow-hidden hover:shadow-lg transition-all duration-300"
                      style={{
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <CardContent className="p-6">
                        <form onSubmit={handleCreatePost} className="space-y-4">
                          <input
                            type="text"
                            placeholder="Post title..."
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                            style={{
                              borderColor: colors.border.primary,
                              backgroundColor: colors.background.primary,
                              color: colors.text.primary,
                            }}
                            required
                          />
                          <textarea
                            placeholder="What's on your mind?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
                            style={{
                              borderColor: colors.border.primary,
                              backgroundColor: colors.background.primary,
                              color: colors.text.primary,
                            }}
                            required
                          />
                          <div className="flex justify-end space-x-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowNewPostForm(false)}
                              className="hover:shadow-lg transition-all duration-300"
                              style={{
                                borderColor: colors.border.primary,
                                color: colors.text.primary,
                                backgroundColor: `${colors.accent.primary}10`,
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="hover:shadow-lg transition-all duration-300"
                              style={{
                                backgroundColor: colors.accent.primary,
                                color: colors.text.inverse,
                              }}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Post
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Posts List */}
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card
                        key={post.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300"
                        style={{
                          backgroundColor: colors.background.card,
                          borderColor: colors.border.primary,
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src={
                                post.authorImage ||
                                `https://ui-avatars.com/api/?name=${post.authorName}&background=random`
                              }
                              alt={post.authorName}
                              className="w-12 h-12 rounded-full shadow-md"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4
                                  className="font-semibold"
                                  style={{ color: colors.text.primary }}
                                >
                                  {post.authorName}
                                </h4>
                                <span
                                  className="text-sm"
                                  style={{ color: colors.text.tertiary }}
                                >
                                  {formatDate(post.createdAt)}
                                </span>
                                {post.isPinned && (
                                  <Badge
                                    className="text-xs"
                                    style={{
                                      backgroundColor: `${colors.accent.warning}20`,
                                      color: colors.accent.warning,
                                      borderColor: colors.border.primary,
                                    }}
                                  >
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                              <h5
                                className="text-lg font-semibold mb-3"
                                style={{ color: colors.text.primary }}
                              >
                                {post.title}
                              </h5>
                              <p
                                className="mb-4"
                                style={{ color: colors.text.secondary }}
                              >
                                {post.content}
                              </p>

                              {/* Tags */}
                              {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {post.tags.map((tag, index) => (
                                    <Badge
                                      key={index}
                                      className="px-2 py-1 text-xs"
                                      style={{
                                        backgroundColor: `${colors.accent.primary}20`,
                                        color: colors.accent.primary,
                                        borderColor: colors.border.primary,
                                      }}
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200">
                                    <Heart className="w-5 h-5" />
                                    <span>{post.likes}</span>
                                  </button>
                                  <button
                                    className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200"
                                    onClick={() => setSelectedPost(post)}
                                  >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>{post.comments}</span>
                                  </button>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    className="p-2 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                                    style={{
                                      backgroundColor: `${colors.accent.primary}10`,
                                    }}
                                  >
                                    <Bookmark className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-2 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                                    style={{
                                      backgroundColor: `${colors.accent.primary}10`,
                                    }}
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-2 hover:bg-opacity-10 rounded-lg transition-all duration-200"
                                    style={{
                                      backgroundColor: `${colors.accent.primary}10`,
                                    }}
                                  >
                                    <Flag className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "members" && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Community Members ({community.members})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* This would show actual member data */}
                    <Card
                      className="overflow-hidden hover:shadow-lg transition-all duration-300"
                      style={{
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.primary,
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          S
                        </div>
                        <h4
                          className="font-semibold mb-1"
                          style={{ color: colors.text.primary }}
                        >
                          Sarah Chen
                        </h4>
                        <Badge
                          className="text-xs"
                          style={{
                            backgroundColor: `${colors.accent.success}20`,
                            color: colors.accent.success,
                            borderColor: colors.border.primary,
                          }}
                        >
                          Admin
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "rules" && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Community Rules
                  </h3>

                  <div className="space-y-4">
                    {community.rules.map((rule, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300"
                        style={{
                          backgroundColor: colors.background.card,
                          borderColor: colors.border.primary,
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                              style={{
                                backgroundColor: `${colors.accent.success}20`,
                                color: colors.accent.success,
                              }}
                            >
                              <span className="font-bold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <p style={{ color: colors.text.primary }}>{rule}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
                borderColor: colors.border.primary,
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {selectedPost.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPost(null)}
                    className="h-10 w-10 p-0 hover:shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: `${colors.accent.primary}10`,
                      color: colors.text.primary,
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mb-6">
                  <p style={{ color: colors.text.secondary }}>
                    {selectedPost.content}
                  </p>
                </div>

                {/* Comments */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Comments ({selectedPost.comments})
                  </h3>

                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                      style={{
                        borderColor: colors.border.primary,
                        backgroundColor: colors.background.primary,
                        color: colors.text.primary,
                      }}
                    />
                    <Button
                      onClick={() => handleCreateComment(selectedPost.id)}
                      className="hover:shadow-lg transition-all duration-300"
                      style={{
                        backgroundColor: colors.accent.primary,
                        color: colors.text.inverse,
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {getCommentsByPostId(selectedPost.id).map((comment) => (
                      <div
                        key={comment.id}
                        className="flex space-x-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md"
                        style={{
                          backgroundColor: colors.background.secondary,
                          border: `1px solid ${colors.border.primary}`,
                        }}
                      >
                        <img
                          src={
                            comment.authorImage ||
                            `https://ui-avatars.com/api/?name=${comment.authorName}&background=random`
                          }
                          alt={comment.authorName}
                          className="w-8 h-8 rounded-full shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className="font-semibold text-sm"
                              style={{ color: colors.text.primary }}
                            >
                              {comment.authorName}
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: colors.text.tertiary }}
                            >
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
