import Head from "next/head";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../../core/contexts/ThemeContext";
import { Layout } from "../../components/layout/Layout";
import { SpotlightHero } from "../../components/shared/SpotlightHero";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../design/system/card";
import { Button } from "../../design/system/button";
import { Badge } from "../../design/system/badge";
import { Input } from "../../design/system/input";
import { Label } from "../../design/system/label";
import { Textarea } from "../../design/system/textarea";
import {
  Users,
  Lightbulb,
  Plus,
  Search,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  Tag,
  Filter,
  TrendingUp,
} from "lucide-react";

interface CommunitySuggestion {
  id: string;
  title: string;
  description: string;
  category: "feature" | "improvement" | "bug-fix" | "content" | "event";
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "pending"
    | "under-review"
    | "approved"
    | "in-progress"
    | "completed"
    | "rejected";
  submittedBy: string;
  submittedAt: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  tags: string[];
}

export default function CommunitySuggestionsPage() {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: "",
    description: "",
    category: "feature" as const,
    priority: "medium" as const,
    tags: "",
  });

  // Mock data for community suggestions
  const suggestions: CommunitySuggestion[] = [
    {
      id: "1",
      title: "Add Dark Mode Toggle",
      description:
        "Implement a system-wide dark mode toggle that users can enable/disable based on their preference. This would improve accessibility and user experience.",
      category: "feature",
      priority: "high",
      status: "approved",
      submittedBy: "Alex Chen",
      submittedAt: "2024-12-15T10:00:00Z",
      upvotes: 45,
      downvotes: 2,
      comments: 8,
      tags: ["UI/UX", "Accessibility", "Theme"],
    },
    {
      id: "2",
      title: "Improve Search Functionality",
      description:
        "Enhance the search feature with filters, autocomplete, and better result ranking. Currently, it's difficult to find specific content quickly.",
      category: "improvement",
      priority: "medium",
      status: "in-progress",
      submittedBy: "Sarah Kim",
      submittedAt: "2024-12-14T14:30:00Z",
      upvotes: 32,
      downvotes: 1,
      comments: 12,
      tags: ["Search", "Performance", "User Experience"],
    },
    {
      id: "3",
      title: "Fix Mobile Navigation Bug",
      description:
        "On mobile devices, the navigation menu sometimes gets stuck and doesn't close properly. This affects the user experience on smaller screens.",
      category: "bug-fix",
      priority: "urgent",
      status: "under-review",
      submittedBy: "David Rodriguez",
      submittedAt: "2024-12-13T16:45:00Z",
      upvotes: 28,
      downvotes: 0,
      comments: 5,
      tags: ["Mobile", "Bug", "Navigation"],
    },
    {
      id: "4",
      title: "Add More Programming Languages",
      description:
        "Expand the supported programming languages to include Rust, Go, and Kotlin. This would attract more developers to the platform.",
      category: "content",
      priority: "medium",
      status: "pending",
      submittedBy: "Maria Johnson",
      submittedAt: "2024-12-12T11:20:00Z",
      upvotes: 19,
      downvotes: 3,
      comments: 6,
      tags: ["Programming", "Languages", "Content"],
    },
    {
      id: "5",
      title: "Host Monthly Hackathon",
      description:
        "Organize monthly virtual hackathons where community members can collaborate on projects, learn new skills, and showcase their work.",
      category: "event",
      priority: "low",
      status: "pending",
      submittedBy: "Tom Wilson",
      submittedAt: "2024-12-11T09:15:00Z",
      upvotes: 15,
      downvotes: 1,
      comments: 4,
      tags: ["Events", "Hackathon", "Collaboration"],
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "feature", label: "New Features" },
    { value: "improvement", label: "Improvements" },
    { value: "bug-fix", label: "Bug Fixes" },
    { value: "content", label: "Content" },
    { value: "event", label: "Events" },
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "under-review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "feature":
        return <Plus className="w-4 h-4" />;
      case "improvement":
        return <TrendingUp className="w-4 h-4" />;
      case "bug-fix":
        return <MessageCircle className="w-4 h-4" />;
      case "content":
        return <Tag className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "feature":
        return "bg-blue-100 text-blue-800";
      case "improvement":
        return "bg-[#08CB00]/10 text-[#08CB00]";
      case "bug-fix":
        return "bg-red-100 text-red-800";
      case "content":
        return "bg-purple-100 text-purple-800";
      case "event":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-[#08CB00]/10 text-[#08CB00]";
      case "in-progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const matchesSearch =
      suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || suggestion.category === selectedCategory;
    const matchesPriority =
      selectedPriority === "all" || suggestion.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === "all" || suggestion.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    // Sort by priority first, then by upvotes
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    return b.upvotes - a.upvotes;
  });

  const handleSubmitSuggestion = () => {
    // Here you would typically send the suggestion to your backend
    console.log("New suggestion:", newSuggestion);

    // Reset form
    setNewSuggestion({
      title: "",
      description: "",
      category: "feature",
      priority: "medium",
      tags: "",
    });

    setShowSuggestionForm(false);
  };

  return (
    <Layout>
      <Head>
        <title>Community Suggestions | Pineder</title>
        <meta
          name="description"
          content="Submit and vote on suggestions to improve the Pineder community platform."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpotlightHero
        title="SUGGESTIONS"
        subtitle="IN THE"
        description="Share your ideas, report bugs, and suggest improvements. Your feedback helps us build a better platform for everyone."
        quote="YOUR VOICE MATTERS, YOUR IDEAS SHAPE THE FUTURE."
        author="Pineder Community"
      />

      <div className="pt-24">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Submit Suggestion Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <Button
              onClick={() => setShowSuggestionForm(true)}
              className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0 px-8 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Suggestion
            </Button>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="grid gap-4 md:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  placeholder="Search suggestions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div>
                <Label htmlFor="category-filter" className="sr-only">
                  Category
                </Label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--pico-primary)]"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <Label htmlFor="priority-filter" className="sr-only">
                  Priority
                </Label>
                <select
                  id="priority-filter"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--pico-primary)]"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <Label htmlFor="status-filter" className="sr-only">
                  Status
                </Label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--pico-primary)]"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Suggestions Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="transition-all duration-300 border-0 shadow-lg hover:shadow-xl hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${getCategoryColor(
                          suggestion.category
                        )} text-xs`}
                      >
                        {getCategoryIcon(suggestion.category)}
                        <span className="ml-1 capitalize">
                          {suggestion.category}
                        </span>
                      </Badge>
                      <Badge
                        className={`${getPriorityColor(
                          suggestion.priority
                        )} text-xs`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <CardTitle
                      className="text-xl"
                      style={{ color: colors.text.primary }}
                    >
                      {suggestion.title}
                    </CardTitle>
                    <Badge
                      className={`${getStatusColor(
                        suggestion.status
                      )} text-xs mt-2`}
                    >
                      {suggestion.status.replace("-", " ")}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {suggestion.description}
                    </p>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {suggestion.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: colors.border.primary,
                              color: colors.text.secondary,
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {suggestion.upvotes}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ThumbsDown
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {suggestion.downvotes}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {suggestion.comments}
                        </span>
                      </div>
                    </div>

                    {/* Submitted By */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--pico-primary)] to-[var(--pico-secondary)] flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {suggestion.submittedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span
                          className="text-sm"
                          style={{ color: colors.text.secondary }}
                        >
                          {suggestion.submittedBy}
                        </span>
                      </div>
                      <span
                        className="text-xs"
                        style={{ color: colors.text.secondary }}
                      >
                        {new Date(suggestion.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        className="flex-1 bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Upvote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      >
                        Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Suggestions Message */}
          {sortedSuggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="py-12 text-center"
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full">
                <Lightbulb className="w-8 h-8 text-gray-400" />
              </div>
              <h3
                className="mb-2 text-xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                No suggestions found
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Try adjusting your search criteria or be the first to submit a
                suggestion!
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Suggestion Form Modal */}
      {showSuggestionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Submit Suggestion</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestionForm(false)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief description of your suggestion"
                  value={newSuggestion.title}
                  onChange={(e) =>
                    setNewSuggestion({
                      ...newSuggestion,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed explanation of your suggestion"
                  value={newSuggestion.description}
                  onChange={(e) =>
                    setNewSuggestion({
                      ...newSuggestion,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newSuggestion.category}
                    onChange={(e) =>
                      setNewSuggestion({
                        ...newSuggestion,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--pico-primary)]"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newSuggestion.priority}
                    onChange={(e) =>
                      setNewSuggestion({
                        ...newSuggestion,
                        priority: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--pico-primary)]"
                  >
                    {priorities.slice(1).map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., UI/UX, Performance, Mobile"
                  value={newSuggestion.tags}
                  onChange={(e) =>
                    setNewSuggestion({ ...newSuggestion, tags: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowSuggestionForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitSuggestion}
                className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0"
              >
                Submit Suggestion
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}
