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
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Hash,
  MessageCircle,
  Calendar,
  MapPin,
  Users2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function CommunityCommunities() {
  const { isDarkMode, colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock data for communities
  const communities = [
    {
      id: 1,
      name: "Web Development Enthusiasts",
      description:
        "A community for web developers to share knowledge, ask questions, and collaborate on projects.",
      members: 1247,
      topics: ["React", "Node.js", "TypeScript", "CSS"],
      recentActivity: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Data Science Learners",
      description:
        "Learn data science, machine learning, and AI together with peers and mentors.",
      members: 892,
      topics: [
        "Python",
        "Machine Learning",
        "Statistics",
        "Data Visualization",
      ],
      recentActivity: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      name: "Mobile App Developers",
      description:
        "Connect with mobile developers, share app ideas, and get feedback on your projects.",
      members: 567,
      topics: ["React Native", "Flutter", "iOS", "Android"],
      recentActivity: "3 days ago",
      status: "active",
    },
    {
      id: 4,
      name: "Design & UX Community",
      description:
        "Explore design principles, user experience, and creative collaboration.",
      members: 445,
      topics: ["UI/UX", "Figma", "Prototyping", "User Research"],
      recentActivity: "1 week ago",
      status: "active",
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Communities | Pineder</title>
        <meta
          name="description"
          content="Join learning communities, connect with peers, and grow together on Pineder."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SpotlightHero
        title="COMMUNITIES"
        subtitle="IN THE"
        description="Join specialized communities based on your interests and learning goals. Connect with peers, share knowledge, and accelerate your growth."
        quote="STAND WHERE TRIUMPH IS NOT ONLY SEEN BUT FELT, A BEACON TO THOSE WHO CHASE GREATNESS."
        author="Pineder Community"
      />

      <div className="pt-24">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">

          {/* Create Community Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <Button className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0 px-8 py-3 text-lg">
              <Plus className="w-5 h-5 mr-2" />
              Create New Community
            </Button>
          </motion.div>

          {/* Communities Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle
                        className="text-xl"
                        style={{ color: colors.text.primary }}
                      >
                        {community.name}
                      </CardTitle>
                      <Badge
                        variant={
                          community.status === "active"
                            ? "default"
                            : "secondary"
                        }
                        className="ml-2"
                      >
                        {community.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {community.description}
                    </p>

                    {/* Topics */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {community.topics.map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: colors.border.primary,
                              color: colors.text.secondary,
                            }}
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Users
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {community.members.toLocaleString()} members
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                        <span style={{ color: colors.text.secondary }}>
                          {community.recentActivity}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        className="flex-1 bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0"
                      >
                        Join Community
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--pico-primary)]/10 to-[var(--pico-secondary)]/10">
              <CardContent className="p-8">
                <h2
                  className="mb-4 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Can&apos;t Find Your Community?
                </h2>
                <p
                  className="mb-6 max-w-2xl mx-auto"
                  style={{ color: colors.text.secondary }}
                >
                  Start your own learning community and bring together people
                  who share your passion. It&apos;s easy to create, manage, and grow
                  your community on Pineder.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  style={{
                    borderColor: colors.accent.primary,
                    color: colors.accent.primary,
                  }}
                  className="hover:bg-[var(--pico-primary)] hover:text-white transition-colors duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Community
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
