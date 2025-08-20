import { useState } from "react";
import { Plus, Users, Hash, Shield, Image as ImageIcon } from "lucide-react";
import { Button } from "../../../design/system/button";
import { Card, CardContent } from "../../../design/system/card";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { Community } from "../../../core/lib/data/communities";
import { Badge } from "../../../design/system/badge";

interface CommunityCreationFormProps {
  onSubmit: (
    community: Omit<
      Community,
      "id" | "createdAt" | "members" | "memberIds" | "recentActivity"
    >
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityCreationForm({
  onSubmit,
  isOpen,
  onClose,
}: CommunityCreationFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [rules, setRules] = useState<string[]>(["Be respectful and inclusive"]);
  const [newRule, setNewRule] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [image, setImage] = useState("");

  const categories = [
    "Programming",
    "Data Science",
    "Mobile Development",
    "Design",
    "DevOps",
    "Product Management",
    "Cybersecurity",
    "AI/ML",
    "Cloud Computing",
    "Other",
  ];

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setTopics(topics.filter((topic) => topic !== topicToRemove));
  };

  const addRule = () => {
    if (newRule.trim() && !rules.includes(newRule.trim())) {
      setRules([...rules, newRule.trim()]);
      setNewRule("");
    }
  };

  const removeRule = (ruleToRemove: string) => {
    setRules(rules.filter((rule) => rule !== ruleToRemove));
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !description.trim() ||
      !category ||
      topics.length === 0
    ) {
      return;
    }

    const newCommunity = {
      name: name.trim(),
      description: description.trim(),
      category,
      topics,
      status: "new" as const,
      createdBy: "Current User", // This would come from auth
      rules,
      isPrivate,
      image: image.trim() || undefined,
    };

    onSubmit(newCommunity);

    // Reset form
    setName("");
    setDescription("");
    setCategory("");
    setTopics([]);
    setRules(["Be respectful and inclusive"]);
    setIsPrivate(false);
    setImage("");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div
        className="relative w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden"
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
              <Users className="w-8 h-8 text-white" />
              <div className="text-white">
                <h2 className="text-2xl font-bold">Create New Community</h2>
                <p style={{ color: colors.text.inverse }}>
                  Build a learning community around your interests
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-white/20 text-white transition-all duration-200"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={submitForm} className="space-y-6">
            {/* Community Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-3"
                style={{ color: colors.text.primary }}
              >
                Community Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., React Developers, Data Science Enthusiasts..."
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
                Community Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your community is about, who it's for, and what members can expect..."
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

            {/* Category and Privacy */}
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
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  Privacy Settings
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-5 h-5"
                    style={{
                      accentColor: colors.accent.primary,
                    }}
                  />
                  <label
                    htmlFor="isPrivate"
                    style={{ color: colors.text.secondary }}
                  >
                    Make this community private (invite-only)
                  </label>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: colors.text.primary }}
              >
                Topics & Tags
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Add a topic..."
                  className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTopic())
                  }
                />
                <Button
                  type="button"
                  onClick={addTopic}
                  className="px-4 py-2 hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: colors.accent.primary,
                    color: colors.text.inverse,
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <Badge
                    key={index}
                    className="flex items-center space-x-1 px-3 py-1"
                    style={{
                      backgroundColor: `${colors.accent.primary}20`,
                      color: colors.accent.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    <Hash className="w-3 h-3" />
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(topic)}
                      className="ml-1 hover:text-red-500 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Community Rules */}
            <div>
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: colors.text.primary }}
              >
                Community Rules
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add a rule..."
                  className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRule())
                  }
                />
                <Button
                  type="button"
                  onClick={addRule}
                  className="px-4 py-2 hover:shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: colors.accent.primary,
                    color: colors.text.inverse,
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {rules.map((rule, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor: colors.background.secondary,
                      border: `1px solid ${colors.border.primary}`,
                    }}
                  >
                    <Shield
                      className="w-4 h-4"
                      style={{ color: colors.accent.primary }}
                    />
                    <span
                      className="flex-1"
                      style={{ color: colors.text.primary }}
                    >
                      {rule}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRule(rule)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-semibold mb-3"
                style={{ color: colors.text.primary }}
              >
                Community Image (Optional)
              </label>
              <div className="flex space-x-2">
                <input
                  id="image"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter image URL..."
                  className="flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-3 hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: `${colors.accent.primary}10`,
                  }}
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Tips */}
            <Card
              className="border-0 shadow-lg overflow-hidden"
              style={{
                backgroundColor: `${colors.accent.primary}10`,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Users
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: colors.accent.primary }}
                  />
                  <div style={{ color: colors.accent.primary }}>
                    <p className="font-medium mb-1">
                      💡 Tips for great communities:
                    </p>
                    <ul className="space-y-1">
                      <li>• Be clear about the community&apos;s purpose</li>
                      <li>• Set clear rules and expectations</li>
                      <li>• Choose relevant topics and tags</li>
                      <li>• Consider privacy needs of your members</li>
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
                className="flex-1 h-12 text-lg border-2 rounded-xl transition-all duration-200 hover:shadow-lg"
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
                className="flex-1 h-12 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
                  color: colors.text.inverse,
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Community
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
