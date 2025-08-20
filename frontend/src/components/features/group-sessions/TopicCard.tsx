import React, { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  Target,
  ThumbsUp,
  ThumbsDown,
  User,
  Calendar,
  Users,
  Clock,
  Star,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import { Card, CardContent } from "../../../design/system/card";
import { Badge } from "../../../design/system/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../design/system/alert-dialog";
import { AnswerModal } from "./AnswerModal";
import { ViewAllAnswersModal } from "./ViewAllAnswersModal";

interface Topic {
  id: string;
  topic: string;
  description: string;
  studentName: string;
  category: string;
  difficulty: string;
  status: string;
  submittedAt: string;
  studentImage?: string;
  studentLevel?: string;
  grade?: string;
  interests?: string;
}

interface TopicCardProps {
  topic: Topic;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  userVote: "upvote" | "downvote" | null;
  onVote: (topicId: string, voteType: "upvote" | "downvote") => void;
  onEdit?: (topic: Topic) => void;
  onDelete?: (topicId: string) => void;
  getMentorImage: (id: string) => string;
  responseCount: number; // Real response count from backend
}

// Helper function to calculate time ago
const getTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  return past.toLocaleDateString();
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  upvotes,
  downvotes,
  totalVotes,
  userVote,
  onVote,
  onEdit,
  onDelete,
  getMentorImage,
  responseCount,
}) => {
  const { user } = useUser();
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [answers, setAnswers] = useState<
    Array<{
      id: string;
      content: string;
      authorName: string;
      authorImage?: string;
      createdAt: string;
      upvotes: number;
      downvotes: number;
      userVote?: "upvote" | "downvote" | null;
      replies?: Array<{
        id: string;
        content: string;
        authorName: string;
        authorImage?: string;
        createdAt: string;
        upvotes: number;
        downvotes: number;
        userVote?: "upvote" | "downvote" | null;
      }>;
    }>
  >([]);

  // Real response count from backend - no more mock data

  const handleVote = (topicId: string, voteType: "upvote" | "downvote") => {
    console.log("Voting on topic:", topicId, "with vote:", voteType);
    onVote(topicId, voteType);
  };

  const handleAnswerSubmit = async (answer: string) => {
    // In real app, this would send the answer to an API
    console.log("Submitting answer:", answer);

    // Create new answer object
    const newAnswer = {
      id: Date.now().toString(),
      content: answer,
      authorName: user?.fullName || user?.firstName || "Anonymous User",
      authorImage: user?.imageUrl,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };

    // Add answer to local state
    setAnswers((prev) => [...prev, newAnswer]);

    // TODO: Send answer to backend API
    // await submitAnswerToBackend(topic.id, answer);

    console.log("Answer submitted for topic:", topic.id);
  };

  const handleReplySubmit = async (answerId: string, replyContent: string) => {
    console.log("Submitting reply to answer:", answerId, replyContent);

    // Create new reply object
    const newReply = {
      id: Date.now().toString(),
      content: replyContent,
      authorName: user?.fullName || user?.firstName || "Anonymous User",
      authorImage: user?.imageUrl,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };

    // Add reply to the specific answer
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.id === answerId
          ? { ...answer, replies: [...(answer.replies || []), newReply] }
          : answer
      )
    );

    console.log("Reply submitted for answer:", answerId);
  };

  const handleVoteAnswer = (
    answerId: string,
    voteType: "upvote" | "downvote"
  ) => {
    console.log("Voting on answer:", answerId, "vote:", voteType);

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) return answer;

        // Check if user already voted
        if (answer.userVote === voteType) {
          // User is clicking the same vote again - remove the vote
          return {
            ...answer,
            upvotes:
              voteType === "upvote" ? answer.upvotes - 1 : answer.upvotes,
            downvotes:
              voteType === "downvote" ? answer.downvotes - 1 : answer.downvotes,
            userVote: null,
          };
        } else if (answer.userVote) {
          // User is changing their vote
          const oldVote = answer.userVote;
          return {
            ...answer,
            upvotes:
              answer.upvotes +
              (voteType === "upvote" ? 1 : -1) +
              (oldVote === "upvote" ? -1 : 0),
            downvotes:
              answer.downvotes +
              (voteType === "downvote" ? 1 : -1) +
              (oldVote === "downvote" ? -1 : 0),
            userVote: voteType,
          };
        } else {
          // User is voting for the first time
          return {
            ...answer,
            upvotes:
              voteType === "upvote" ? answer.upvotes + 1 : answer.upvotes,
            downvotes:
              voteType === "downvote" ? answer.downvotes + 1 : answer.downvotes,
            userVote: voteType,
          };
        }
      })
    );

    // TODO: Send vote to backend API
    // await submitVoteToBackend(answerId, voteType);
  };

  const handleVoteReply = (
    answerId: string,
    replyId: string,
    voteType: "upvote" | "downvote"
  ) => {
    console.log("Voting on reply:", replyId, "vote:", voteType);

    setAnswers((prev) =>
      prev.map((answer) => {
        if (answer.id !== answerId) return answer;

        return {
          ...answer,
          replies:
            answer.replies?.map((reply) => {
              if (reply.id !== replyId) return reply;

              // Check if user already voted
              if (reply.userVote === voteType) {
                // User is clicking the same vote again - remove the vote
                return {
                  ...reply,
                  upvotes:
                    voteType === "upvote" ? reply.upvotes - 1 : reply.upvotes,
                  downvotes:
                    voteType === "downvote"
                      ? reply.downvotes - 1
                      : reply.downvotes,
                  userVote: null,
                };
              } else if (reply.userVote) {
                // User is changing their vote
                const oldVote = reply.userVote;
                return {
                  ...reply,
                  upvotes:
                    reply.upvotes +
                    (voteType === "upvote" ? 1 : -1) +
                    (oldVote === "upvote" ? -1 : 0),
                  downvotes:
                    reply.downvotes +
                    (voteType === "downvote" ? 1 : -1) +
                    (oldVote === "downvote" ? -1 : 0),
                  userVote: voteType,
                };
              } else {
                // User is voting for the first time
                return {
                  ...reply,
                  upvotes:
                    voteType === "upvote" ? reply.upvotes + 1 : reply.upvotes,
                  downvotes:
                    voteType === "downvote"
                      ? reply.downvotes + 1
                      : reply.downvotes,
                  userVote: voteType,
                };
              }
            }) || [],
        };
      })
    );

    // TODO: Send vote to backend API
    // await submitVoteReplyToBackend(answerId, replyId, voteType);
  };

  return (
    <motion.div
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: 2,
        z: 25,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ perspective: 1000 }}
    >
      <Card className="border-0 shadow-md bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-2xl h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Topic Header */}
          <div className="bg-white p-6 pb-4">
            <div className="flex items-start space-x-4">
              {/* Student Profile Picture */}
              <div className="flex-shrink-0 relative">
                <img
                  src={topic.studentImage || getMentorImage(topic.id)}
                  alt={`${topic.studentName}'s profile`}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg"
                />
              </div>

              {/* Topic Title and Student Name */}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {topic.topic}
                </h3>
                <p className="text-lg text-gray-600 font-medium mb-3">
                  {topic.studentName}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex items-center space-x-2">
                {/* Edit Button */}
                {onEdit && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(topic)}
                      className="p-2 text-[#58CC02] hover:text-[#46A302] hover:bg-[#58CC02]/10 rounded-lg transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}

                {/* Delete Button */}
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border-0 shadow-2xl rounded-3xl p-8 max-w-md">
                      <AlertDialogHeader className="text-center">
                        <AlertDialogTitle className="text-2xl font-bold text-gray-900 mb-3">
                          Delete Topic
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 text-base leading-relaxed">
                          Are you sure you want to delete "{topic.topic}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
                        <AlertDialogCancel className="flex-1 px-6 py-3 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border-0 transition-all duration-300 hover:scale-105">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(topic.id)}
                          className="flex-1 px-6 py-3 rounded-2xl font-semibold bg-[#58CC02] hover:bg-[#46A302] text-white shadow-xl shadow-[#58CC02]/30 border-2 border-[#58CC02] transition-all duration-300 hover:scale-105 transform"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>

          {/* Topic Details Grid */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">
                  {new Date(topic.submittedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Category */}
              <div
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                  topic.category === "Frontend Development"
                    ? "bg-blue-50 border-blue-200"
                    : topic.category === "Backend Development"
                    ? "bg-purple-50 border-purple-200"
                    : topic.category === "Full-Stack Development"
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Target
                  className={`w-4 h-4 ${
                    topic.category === "Frontend Development"
                      ? "text-blue-600"
                      : topic.category === "Backend Development"
                      ? "text-purple-600"
                      : topic.category === "Full-Stack Development"
                      ? "text-purple-600"
                      : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    topic.category === "Frontend Development"
                      ? "text-blue-700"
                      : topic.category === "Backend Development"
                      ? "text-purple-700"
                      : topic.category === "Full-Stack Development"
                      ? "text-purple-700"
                      : "text-gray-700"
                  }`}
                >
                  {topic.category}
                </span>
              </div>

              {/* Difficulty */}
            </div>
          </div>

          {/* Student Question Section */}
          <div className="px-6 pb-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="space-y-3">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {topic.description ||
                    "Tell us more about what you want to learn"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeAgo(topic.submittedAt)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>
                        {answers.length} response
                        {answers.length !== 1 ? "s" : ""}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAnswerModalOpen(true)}
                      className="px-3 py-1.5 text-xs border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      Reply
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsViewAllModalOpen(true)}
                      className="px-3 py-1.5 text-xs border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      View All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Section */}
          <div className="px-6 pb-6 flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                {/* Upvote Section */}
                <div className="flex items-center space-x-3 group">
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      rotateY: 15,
                      rotateX: 5,
                      z: 20,
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ perspective: 600 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(topic.id, "upvote")}
                      disabled={false}
                      className={`p-3 rounded-2xl transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg ${
                        userVote === "upvote"
                          ? "bg-gradient-to-br from-green-400 to-green-500 text-white shadow-lg scale-105 border-2 border-green-300"
                          : "hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 hover:text-green-600 border-2 border-transparent hover:border-green-200"
                      }`}
                    >
                      <ThumbsUp
                        className={`w-5 h-5 transition-all duration-300 ${
                          userVote === "upvote"
                            ? "text-white"
                            : "text-gray-500 group-hover:text-green-600"
                        }`}
                      />
                    </Button>
                  </motion.div>
                  <div className="min-w-[2.5rem] text-center">
                    <span
                      className={`text-lg font-bold transition-all duration-300 ${
                        userVote === "upvote"
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {upvotes}
                    </span>
                  </div>
                </div>

                {/* Downvote Section */}
                <div className="flex items-center space-x-3 group">
                  <motion.div
                    whileHover={{
                      scale: 1.15,
                      rotateY: -15,
                      rotateX: 5,
                      z: 20,
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ perspective: 600 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(topic.id, "downvote")}
                      disabled={false}
                      className={`p-3 rounded-2xl transition-all duration-300 ease-out transform hover:scale-110 hover:shadow-lg ${
                        userVote === "downvote"
                          ? "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg scale-105 border-2 border-red-300"
                          : "hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:text-red-600 border-2 border-transparent hover:border-red-200"
                      }`}
                    >
                      <ThumbsDown
                        className={`w-5 h-5 transition-all duration-300 ${
                          userVote === "downvote"
                            ? "text-white"
                            : "text-gray-500 group-hover:text-red-600"
                        }`}
                      />
                    </Button>
                  </motion.div>
                  <div className="min-w-[2.5rem] text-center">
                    <span
                      className={`text-lg font-bold transition-all duration-300 ${
                        userVote === "downvote"
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {downvotes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Modal */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        topicTitle={topic.topic}
        studentName={topic.studentName}
        onAnswerSubmit={handleAnswerSubmit}
        onReplySubmit={handleReplySubmit}
        onVoteAnswer={handleVoteAnswer}
        onVoteReply={handleVoteReply}
        existingAnswers={answers}
      />

      {/* View All Answers Modal */}
      <ViewAllAnswersModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        topicTitle={topic.topic}
        studentName={topic.studentName}
        answers={answers}
        onVoteAnswer={handleVoteAnswer}
      />
    </motion.div>
  );
};
