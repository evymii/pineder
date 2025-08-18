import { useState } from "react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import {
  ThumbsUp,
  ThumbsDown,
  Users,
  Clock,
  Target,
  BookOpen,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../design/system/card";
import { Badge } from "../../../design/system/badge";
import { TopicSubmission, TopicVote } from "../../../core/lib/data/groupSessions";

interface TopicVotingProps {
  topics: TopicSubmission[];
  votes: TopicVote[];
  onVote: (topicId: string, vote: "upvote" | "downvote") => void;
}

export function TopicVoting({ topics, votes, onVote }: TopicVotingProps) {
  const { isDarkMode, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(topics.map((t) => t.category))),
  ];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  const getVoteCount = (topicId: string, voteType: "upvote" | "downvote") => {
    return votes.filter((v) => v.topicId === topicId && v.vote === voteType)
      .length;
  };

  const getUserVote = (topicId: string) => {
    // This would come from auth context
    const currentUserId = "current-student";
    const userVote = votes.find(
      (v) => v.topicId === topicId && v.studentId === currentUserId
    );
    return userVote?.vote || null;
  };

  const filteredTopics = topics.filter((topic) => {
    const categoryMatch =
      selectedCategory === "all" || topic.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === "all" || topic.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const sortedTopics = [...filteredTopics].sort((a, b) => {
    const aVotes =
      getVoteCount(a.id, "upvote") - getVoteCount(a.id, "downvote");
    const bVotes =
      getVoteCount(b.id, "upvote") - getVoteCount(b.id, "downvote");
    return bVotes - aVotes;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return {
          backgroundColor: `${colors.accent.success}20`,
          color: colors.accent.success,
        };
      case "intermediate":
        return {
          backgroundColor: `${colors.accent.warning}20`,
          color: colors.accent.warning,
        };
      case "advanced":
        return {
          backgroundColor: `${colors.accent.error}20`,
          color: colors.accent.error,
        };
      default:
        return {
          backgroundColor: `${colors.text.muted}20`,
          color: colors.text.muted,
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: `${colors.accent.warning}20`,
          color: colors.accent.warning,
        };
      case "approved":
        return {
          backgroundColor: `${colors.accent.success}20`,
          color: colors.accent.success,
        };
      case "enhanced":
        return {
          backgroundColor: `${colors.accent.primary}20`,
          color: colors.accent.primary,
        };
      case "rejected":
        return {
          backgroundColor: `${colors.accent.error}20`,
          color: colors.accent.error,
        };
      default:
        return {
          backgroundColor: `${colors.text.muted}20`,
          color: colors.text.muted,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card
        className="border-0 shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor: `${colors.background.primary}80`,
        }}
      >
        <CardHeader>
          <CardTitle
            className="flex items-center space-x-2"
            style={{ color: colors.text.primary }}
          >
            <Target
              className="w-5 h-5"
              style={{ color: colors.accent.primary }}
            />
            <span>Filter Topics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Difficulties" : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics List */}
      <div className="space-y-4">
        {sortedTopics.map((topic) => {
          const upvotes = getVoteCount(topic.id, "upvote");
          const downvotes = getVoteCount(topic.id, "downvote");
          const totalVotes = upvotes - downvotes;
          const userVote = getUserVote(topic.id);

          return (
            <Card
              key={topic.id}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Topic Header */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {topic.topic}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>
                    </div>

                    {/* Topic Meta */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge
                        className={`${
                          getDifficultyColor(topic.difficulty).backgroundColor
                        } ${getDifficultyColor(topic.difficulty).color}`}
                      >
                        {topic.difficulty}
                      </Badge>
                      <Badge
                        className={`${
                          getStatusColor(topic.status).backgroundColor
                        } ${getStatusColor(topic.status).color}`}
                      >
                        {topic.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{topic.studentName}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(topic.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Voting Section */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onVote(topic.id, "upvote")}
                          className={`p-2 rounded-lg transition-colors ${
                            userVote === "upvote"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[2rem] text-center">
                          {upvotes}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onVote(topic.id, "downvote")}
                          className={`p-2 rounded-lg transition-colors ${
                            userVote === "downvote"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[2rem] text-center">
                          {downvotes}
                        </span>
                      </div>

                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Total: {totalVotes}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedTopics.length === 0 && (
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No topics found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your filters or suggest a new topic!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
