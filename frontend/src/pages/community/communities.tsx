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
import { Users, Plus, MessageCircle } from "lucide-react";
import Link from "next/link";
import { CommunityCreationForm } from "../../components/features/community/CommunityCreationForm";
import { CommunityDetails } from "../../components/features/community/CommunityDetails";
import { mockCommunities, Community } from "../../core/lib/data/communities";

export default function CommunityCommunities() {
  const { isDarkMode, colors } = useTheme();
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateCommunity = (
    newCommunity: Omit<
      Community,
      "id" | "createdAt" | "members" | "memberIds" | "recentActivity"
    >
  ) => {
    const community: Community = {
      ...newCommunity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      members: 1,
      memberIds: ["currentUser"],
      recentActivity: "Just now",
    };

    setCommunities([community, ...communities]);
    setSuccessMessage("Community created successfully!");
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 5000);
  };

  const handleJoinLeave = (communityId: string, action: "join" | "leave") => {
    setCommunities(
      communities.map((community) => {
        if (community.id === communityId) {
          if (action === "join") {
            return {
              ...community,
              members: community.members + 1,
              memberIds: [...community.memberIds, "currentUser"],
            };
          } else {
            return {
              ...community,
              members: Math.max(0, community.members - 1),
              memberIds: community.memberIds.filter(
                (id) => id !== "currentUser"
              ),
            };
          }
        }
        return community;
      })
    );

    const actionText = action === "join" ? "joined" : "left";
    setSuccessMessage(`Successfully ${actionText} the community!`);
    setShowSuccessNotification(true);
    setTimeout(() => setShowSuccessNotification(false), 5000);
  };

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
        author="Pineder Community"
      />

      <div className="pt-24">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0 px-8 py-3 text-lg hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Community
            </Button>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card
                  className="transition-all duration-300 border-0 shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
                  style={{
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.primary,
                  }}
                >
                  {community.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={community.image}
                        alt={community.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <Badge
                          variant={
                            community.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="ml-2"
                          style={{
                            backgroundColor:
                              community.status === "active"
                                ? colors.accent.success
                                : colors.accent.info,
                            color: colors.text.inverse,
                          }}
                        >
                          {community.status}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle
                        className="text-xl font-bold"
                        style={{ color: colors.text.primary }}
                      >
                        {community.name}
                      </CardTitle>
                      {!community.image && (
                        <Badge
                          variant={
                            community.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="ml-2"
                          style={{
                            backgroundColor:
                              community.status === "active"
                                ? colors.accent.success
                                : colors.accent.info,
                            color: colors.text.inverse,
                          }}
                        >
                          {community.status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {community.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {community.topics.slice(0, 4).map((topic) => (
                          <Badge
                            key={topic}
                            variant="outline"
                            className="text-xs px-2 py-1"
                            style={{
                              borderColor: colors.border.primary,
                              color: colors.text.secondary,
                              backgroundColor: `${colors.accent.primary}10`,
                            }}
                          >
                            {topic}
                          </Badge>
                        ))}
                        {community.topics.length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1"
                            style={{
                              borderColor: colors.border.primary,
                              color: colors.text.secondary,
                            }}
                          >
                            +{community.topics.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 text-sm">
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

                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        className="flex-1 bg-gradient-to-r from-[var(--pico-primary)] to-[var(--pico-secondary)] text-white border-0 hover:shadow-lg transition-all duration-300"
                        onClick={() => handleJoinLeave(community.id, "join")}
                      >
                        Join Community
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-4 py-2 hover:bg-opacity-10 transition-all duration-300"
                        style={{
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                          backgroundColor: `${colors.accent.primary}10`,
                        }}
                        onClick={() => setSelectedCommunity(community)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Card
              className="border-0 shadow-lg overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.accent.primary}10 0%, ${colors.accent.secondary}10 100%)`,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-8">
                <h2
                  className="mb-4 text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Can&apos;t Find Your Community?
                </h2>
                <p
                  className="max-w-2xl mx-auto mb-6"
                  style={{ color: colors.text.secondary }}
                >
                  Start your own learning community and bring together people
                  who share your passion. It&apos;s easy to create, manage, and
                  grow your community on Pineder.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-3 text-lg hover:shadow-lg transition-all duration-300"
                  style={{
                    borderColor: colors.accent.primary,
                    color: colors.accent.primary,
                    backgroundColor: `${colors.accent.primary}10`,
                  }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Community
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Community Creation Form */}
      <CommunityCreationForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateCommunity}
      />

      {/* Community Details Modal */}
      {selectedCommunity && (
        <CommunityDetails
          community={selectedCommunity}
          isOpen={!!selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
          onJoinLeave={handleJoinLeave}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed z-50 top-4 right-4"
        >
          <div
            className="px-6 py-3 text-white rounded-lg shadow-lg border"
            style={{
              backgroundColor: colors.accent.success,
              borderColor: colors.border.primary,
            }}
          >
            {successMessage}
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
