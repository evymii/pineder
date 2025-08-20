import { useState } from "react";
import { Plus, BookOpen, Lightbulb, Target } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { TopicSubmission } from "../../../core/lib/data/groupSessions";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TopicSubmissionFormProps {
  onSubmit: (
    topic: Omit<TopicSubmission, "id" | "submittedAt" | "status">
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TopicSubmissionForm({
  onSubmit,
  isOpen,
  onClose,
}: TopicSubmissionFormProps) {
  const { colors } = useTheme();
  const { user } = useUser();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    "Backend Development",
    "Frontend Development",
    "Full-Stack Development",
  ];

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim() || !description.trim() || !category) {
      return;
    }

    // Debug user info
    console.log("User object:", user);
    console.log("User imageUrl:", user?.imageUrl);
    console.log("User profileImage:", (user as any)?.profileImage);
    console.log("User fullName:", user?.fullName);
    console.log("User firstName:", user?.firstName);
    console.log("User publicMetadata:", user?.publicMetadata);

    const newTopic = {
      studentId: user?.id || "current-student", // Use real user ID
      studentName: user?.fullName || user?.firstName || "Current Student", // Use real user name
      studentImage:
        user?.imageUrl ||
        (user as any)?.profileImage ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", // Use real user image with better fallback
      topic: topic.trim(),
      description: description.trim(),
      category,
      email: user?.primaryEmailAddress?.emailAddress || "", // Use real user email
    };

    onSubmit(newTopic);

    // Reset form (but keep user info)
    setTopic("");
    setDescription("");
    setCategory("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg sm:rounded-xl shadow-lg border mx-2"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 rounded-t-3xl bg-gray-50/80 backdrop-blur-md border-b-2"
          style={{
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between p-2 sm:p-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#58CC02]" />
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#58CC02]">
                  Suggest a Learning Topic
                </h2>
                <p className="text-xs text-[#46A302]">
                  Help shape our group study sessions
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-[#58CC02]/10 text-[#58CC02]"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-2 sm:p-3 md:p-4">
          <form
            onSubmit={submitForm}
            className="space-y-2 sm:space-y-3 md:space-y-4"
          >
            {/* Topic Title */}
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                What do you want to learn?
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., React Performance Optimization, MongoDB Aggregations..."
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.text.primary }}
              >
                Tell us more about what you want to learn
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning goals, what you're struggling with, or what you hope to achieve..."
                rows={3}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className={`block text-sm font-semibold mb-2 ${
                  category === "Frontend Development"
                    ? "text-orange-600"
                    : category === "Backend Development"
                    ? "text-purple-600"
                    : category === "Full-Stack Development"
                    ? "text-purple-600"
                    : ""
                }`}
                style={{
                  color:
                    category === "Frontend Development"
                      ? "#ea580c"
                      : category === "Backend Development"
                      ? "#9333ea"
                      : category === "Full-Stack Development"
                      ? "#9333ea"
                      : colors.text.primary,
                }}
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  category === "Frontend Development"
                    ? "border-orange-400 focus:border-orange-500"
                    : category === "Backend Development"
                    ? "border-purple-400 focus:border-purple-500"
                    : category === "Full-Stack Development"
                    ? "border-purple-400 focus:border-blue-500"
                    : ""
                }`}
                style={{
                  borderColor:
                    category === "Frontend Development"
                      ? "#fb923c"
                      : category === "Backend Development"
                      ? "#a855f7"
                      : category === "Full-Stack Development"
                      ? "#a855f7"
                      : colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tips */}
            <Card
              className="border-0 shadow-lg"
              style={{
                backgroundColor: `${colors.accent.primary}10`,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: colors.accent.primary }}
                  />
                  <div style={{ color: colors.accent.primary }}>
                    <p className="font-medium mb-1">
                      💡 Tips for great topic suggestions:
                    </p>
                    <ul className="space-y-1">
                      <li>• Be specific about what you want to learn</li>
                      <li>• Mention any challenges you&apos;re facing</li>
                      <li>• Include real-world examples if possible</li>
                      <li>• Consider what others might also benefit from</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 sm:h-12 text-base sm:text-lg border-2 rounded-xl transition-all duration-200"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 sm:h-12 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
                  color: colors.text.inverse,
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit Topic
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
