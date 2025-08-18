import { useState } from "react";
import { Plus, BookOpen, Lightbulb, Target } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../design/system/card";
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
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");

  const categories = [
    "Frontend Development",
    "Backend Development",
    "Full-Stack Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Cybersecurity",
    "UI/UX Design",
    "Other",
  ];

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim() || !description.trim() || !category) {
      return;
    }

    const newTopic = {
      studentId: "current-student", // This would come from auth
      studentName: "Current Student", // This would come from auth
      studentImage: "/api/placeholder/32/32", // This would come from auth
      topic: topic.trim(),
      description: description.trim(),
      category,
      difficulty,
    };

    onSubmit(newTopic);

    // Reset form
    setTopic("");
    setDescription("");
    setCategory("");
    setDifficulty("intermediate");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl rounded-3xl shadow-2xl border"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
          borderColor: colors.border.primary,
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 rounded-t-3xl"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
          }}
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-8 h-8 text-white" />
              <div className="text-white">
                <h2 className="text-2xl font-bold">Suggest a Learning Topic</h2>
                <p style={{ color: colors.text.inverse }}>
                  Help shape our group study sessions
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-white/20 text-white"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={submitForm} className="space-y-6">
            {/* Topic Title */}
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-semibold mb-3"
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
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
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
                className="block text-sm font-semibold mb-3"
                style={{ color: colors.text.primary }}
              >
                Tell us more about what you want to learn
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning goals, what you're struggling with, or what you hope to achieve..."
                rows={4}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                }}
                required
              />
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
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

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(
                      e.target.value as "beginner" | "intermediate" | "advanced"
                    )
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
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
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 text-lg border-2 rounded-xl transition-all duration-200"
                style={{
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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
