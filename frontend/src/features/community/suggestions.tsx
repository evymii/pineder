import { motion } from "framer-motion";
import {
  Lightbulb,
  Plus,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../../design/system/button";
import { Layout } from "../../components/layout/Layout";
import { useState } from "react";

export default function CommunitySuggestions() {
  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      title: "Add more programming language courses",
      description:
        "I think we should expand our course offerings to include more programming languages like Python, Java, and C++.",
      author: "Alex Chen",
      date: "2024-12-10",
      upvotes: 24,
      comments: 8,
      status: "Under Review",
      category: "Course Content",
    },
    {
      id: 2,
      title: "Create a study group feature",
      description:
        "It would be great to have a feature where students can form study groups and collaborate on projects together.",
      author: "Sarah Johnson",
      date: "2024-12-08",
      upvotes: 31,
      comments: 12,
      status: "In Progress",
      category: "Features",
    },
    {
      id: 3,
      title: "Add mobile app for offline learning",
      description:
        "A mobile app would allow students to learn on the go and download content for offline viewing.",
      author: "Mike Rodriguez",
      date: "2024-12-05",
      upvotes: 45,
      comments: 15,
      status: "Planned",
      category: "Platform",
    },
    {
      id: 4,
      title: "Implement peer review system",
      description:
        "A peer review system would help students learn from each other and improve their code quality.",
      author: "Emily Davis",
      date: "2024-12-03",
      upvotes: 19,
      comments: 6,
      status: "Under Review",
      category: "Learning Tools",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: "",
    description: "",
    category: "Features",
  });

  const categories = [
    "Features",
    "Course Content",
    "Platform",
    "Learning Tools",
    "Community",
    "Other",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planned":
        return "bg-purple-100 text-purple-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSuggestion.title && newSuggestion.description) {
      const suggestion = {
        id: suggestions.length + 1,
        title: newSuggestion.title,
        description: newSuggestion.description,
        author: "Current User",
        date: new Date().toISOString().split("T")[0],
        upvotes: 0,
        comments: 0,
        status: "Under Review",
        category: newSuggestion.category,
      };
      setSuggestions([suggestion, ...suggestions]);
      setNewSuggestion({ title: "", description: "", category: "Features" });
      setShowForm(false);
    }
  };

  const handleUpvote = (id: number) => {
    setSuggestions(
      suggestions.map((s) =>
        s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s
      )
    );
  };

  return (
    <Layout className="bg-white dark:bg-[#222222]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community Suggestions
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Share your ideas and help shape the future of our learning
              platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Header Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Community Ideas
            </h2>
            <p className="text-muted-foreground">
              Vote on existing suggestions or submit your own
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "Submit Suggestion"}
          </Button>
        </motion.div>

        {/* New Suggestion Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border border-white/20 rounded-lg p-6 mb-8 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Submit New Suggestion
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Suggestion Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newSuggestion.title}
                  onChange={(e) =>
                    setNewSuggestion({
                      ...newSuggestion,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--pico-secondary)]"
                  placeholder="Enter a clear, descriptive title"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={newSuggestion.description}
                  onChange={(e) =>
                    setNewSuggestion({
                      ...newSuggestion,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--pico-secondary)]"
                  placeholder="Describe your suggestion in detail"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={newSuggestion.category}
                  onChange={(e) =>
                    setNewSuggestion({
                      ...newSuggestion,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--pico-secondary)]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white hover:opacity-90 transition-opacity"
                >
                  Submit Suggestion
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Suggestions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="glass border border-white/20 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Lightbulb className="w-5 h-5 text-[var(--pico-secondary)]" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {suggestion.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{suggestion.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{suggestion.date}</span>
                    </div>
                    <span className="px-2 py-1 bg-[var(--pico-secondary)]/10 text-[var(--pico-secondary)] rounded-full text-xs">
                      {suggestion.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      suggestion.status
                    )}`}
                  >
                    {suggestion.status}
                  </span>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpvote(suggestion.id)}
                      className="flex items-center space-x-1 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{suggestion.upvotes}</span>
                    </Button>

                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <MessageSquare className="w-4 h-4" />
                      <span>{suggestion.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Lightbulb className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No suggestions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Be the first to share your ideas with the community!
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[var(--pico-secondary)] to-[var(--pico-accent)] text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit First Suggestion
            </Button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
