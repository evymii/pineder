import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "../../components/layout";
import { Button } from "../../design/system/button";
import { Card, CardContent } from "../../design/system/card";
import { Input } from "../../design/system/input";
import { Label } from "../../design/system/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../design/system/avatar";
import { Badge } from "../../design/system/badge";
import {
  Edit,
  LogOut,
  Mail,
  Phone,
  User,
  GraduationCap,
  Hash,
  Globe,
  Github,
  ExternalLink,
  MapPin,
  Star,
} from "lucide-react";

interface StudentProfile {
  fullName: string;
  nickname: string;
  major: string;
  studentCode: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  isOnline: boolean;
  links: {
    github?: string;
    portfolio?: string;
    linkedin?: string;
  };
  stats: {
    sessionsCompleted: number;
    totalHours: number;
    rating: number;
    mentorsWorkedWith: number;
  };
}

const StudentProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "Alex Johnson",
    nickname: "AJ",
    major: "Software Engineering / Design",
    studentCode: "STU2024001",
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate software engineering student with a focus on UI/UX design. Always eager to learn from experienced mentors and contribute to innovative projects.",
    avatar: "/api/placeholder/150/150",
    backgroundImage: "/api/placeholder/1200/300",
    isOnline: true,
    links: {
      github: "https://github.com/alexjohnson",
      portfolio: "https://alexjohnson.dev",
      linkedin: "https://linkedin.com/in/alexjohnson",
    },
    stats: {
      sessionsCompleted: 24,
      totalHours: 48,
      rating: 4.8,
      mentorsWorkedWith: 8,
    },
  });

  const [editForm, setEditForm] = useState<StudentProfile>(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (
    platform: keyof StudentProfile["links"],
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      links: { ...prev.links, [platform]: value },
    }));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Profile Banner */}
        <div className="relative overflow-hidden h-80 bg-gradient-to-r from-blue-500 to-purple-600">
          <img
            src={profile.backgroundImage}
            alt="Profile background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Profile Avatar */}
          <div className="absolute bottom-0 transform -translate-x-1/2 translate-y-1/2 left-1/2">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.fullName} />
                <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600">
                  {profile.nickname}
                </AvatarFallback>
              </Avatar>

              {/* Online Status Indicator */}
              {profile.isOnline && (
                <div className="absolute w-6 h-6 bg-green-500 border-4 border-white rounded-full bottom-2 right-2" />
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-12 mx-auto -mt-16 max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Personal Information */}
            <div className="space-y-6 lg:col-span-2">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h1 className="mb-2 text-3xl font-bold text-foreground">
                        {isEditing ? (
                          <Input
                            value={editForm.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            className="p-0 text-3xl font-bold text-center bg-transparent border-0 lg:text-left"
                          />
                        ) : (
                          <span
                            className="transition-colors cursor-pointer hover:text-accent"
                            title="Hover to see nickname"
                          >
                            {profile.fullName}
                          </span>
                        )}
                      </h1>

                      {!isEditing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mb-4 text-lg text-muted-foreground"
                        >
                          {profile.nickname} • {profile.major}
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-6 lg:grid-cols-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile.stats.sessionsCompleted}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sessions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile.stats.totalHours}h
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Hours
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile.stats.rating}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rating
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile.stats.mentorsWorkedWith}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mentors
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Major/Role
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.major}
                            onChange={(e) =>
                              handleInputChange("major", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1 text-foreground">
                            <GraduationCap className="w-4 h-4" />
                            {profile.major}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Student Code
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.studentCode}
                            onChange={(e) =>
                              handleInputChange("studentCode", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1 text-foreground">
                            <Hash className="w-4 h-4" />
                            {profile.studentCode}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Email
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="mt-1"
                            type="email"
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1 text-foreground">
                            <Mail className="w-4 h-4" />
                            {profile.email}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Phone
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="mt-1"
                            type="tel"
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1 text-foreground">
                            <Phone className="w-4 h-4" />
                            {profile.phone}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Location
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <div className="flex items-center gap-2 mt-1 text-foreground">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Bio
                      </Label>
                      {isEditing ? (
                        <textarea
                          value={editForm.bio}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          className="w-full p-3 mt-1 border rounded-lg resize-none"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{profile.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Links and Actions */}
            <div className="space-y-6">
              {/* Links Section */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                    <Globe className="w-5 h-5" />
                    Links
                  </h3>

                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            GitHub
                          </Label>
                          <Input
                            value={editForm.links.github || ""}
                            onChange={(e) =>
                              handleLinkChange("github", e.target.value)
                            }
                            placeholder="https://github.com/username"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Portfolio
                          </Label>
                          <Input
                            value={editForm.links.portfolio || ""}
                            onChange={(e) =>
                              handleLinkChange("portfolio", e.target.value)
                            }
                            placeholder="https://yourportfolio.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            LinkedIn
                          </Label>
                          <Input
                            value={editForm.links.linkedin || ""}
                            onChange={(e) =>
                              handleLinkChange("linkedin", e.target.value)
                            }
                            placeholder="https://linkedin.com/in/username"
                            className="mt-1"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {profile.links.github && (
                          <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 transition-colors border rounded-lg hover:bg-accent/50"
                          >
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                        {profile.links.portfolio && (
                          <a
                            href={profile.links.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 transition-colors border rounded-lg hover:bg-accent/50"
                          >
                            <Globe className="w-5 h-5" />
                            <span>Portfolio</span>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                        {profile.links.linkedin && (
                          <a
                            href={profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 transition-colors border rounded-lg hover:bg-accent/50"
                          >
                            <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded">
                              <span className="text-xs font-bold text-white">
                                in
                              </span>
                            </div>
                            <span>LinkedIn</span>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Owner Actions */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Account Actions
                  </h3>

                  <div className="space-y-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} className="w-full">
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="w-full"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="destructive" className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfilePage;
