import React, { useState, useEffect } from "react";
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
import { useRouter } from "next/router";

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
  const router = useRouter();
  const usernameParam = (router.query.username as string) || "";
  // This would typically come from route params or context
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  // Mock Student Data Examples (for future use with different profiles)
  const mockStudents: Record<string, StudentProfile> = {
    "sarah-chen": {
      fullName: "Sarah Chen",
      nickname: "SC",
      major: "Computer Science & Artificial Intelligence",
      studentCode: "STU2024001",
      email: "sarah.chen@stanford.edu",
      phone: "+1 (650) 555-0123",
      location: "Stanford, CA",
      bio: "Final year CS student specializing in AI/ML and full-stack development. Passionate about building scalable applications and contributing to open-source projects. Previously interned at Google and Microsoft. Looking to connect with mentors in the AI industry.",
      avatar: "",
      backgroundImage: "",
      isOnline: true,
      links: {
        github: "https://github.com/sarahchen-dev",
        portfolio: "https://sarahchen.dev",
        linkedin: "https://linkedin.com/in/sarahchen-ai",
      },
      stats: {
        sessionsCompleted: 47,
        totalHours: 89,
        rating: 4.9,
        mentorsWorkedWith: 12,
      },
    },
    "mike-rodriguez": {
      fullName: "Mike Rodriguez",
      nickname: "MR",
      major: "Data Science & Business Analytics",
      studentCode: "STU2024002",
      email: "mike.rodriguez@berkeley.edu",
      phone: "+1 (510) 555-0456",
      location: "Berkeley, CA",
      bio: "Data science enthusiast with a passion for turning complex data into actionable insights. Currently working on a capstone project analyzing startup success patterns. Seeking mentorship in data engineering and business intelligence.",
      avatar: "",
      backgroundImage: "",
      isOnline: false,
      links: {
        github: "https://github.com/mikerodriguez-ds",
        portfolio: "https://mikerodriguez.tech",
        linkedin: "https://linkedin.com/in/mikerodriguez-ds",
      },
      stats: {
        sessionsCompleted: 23,
        totalHours: 41,
        rating: 4.7,
        mentorsWorkedWith: 6,
      },
    },
    "emma-watson": {
      fullName: "Emma Watson",
      nickname: "EW",
      major: "UX/UI Design & Frontend Development",
      studentCode: "STU2024003",
      email: "emma.watson@risd.edu",
      phone: "+1 (401) 555-0789",
      location: "Providence, RI",
      bio: "Creative designer and frontend developer with a love for beautiful, accessible user experiences. Specializing in React and design systems. Looking for mentors in product design and frontend architecture.",
      avatar: "",
      backgroundImage: "",
      isOnline: true,
      links: {
        github: "https://github.com/emmawatson-design",
        portfolio: "https://emmawatson.design",
        linkedin: "https://linkedin.com/in/emmawatson-ux",
      },
      stats: {
        sessionsCompleted: 31,
        totalHours: 58,
        rating: 4.8,
        mentorsWorkedWith: 9,
      },
    },
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: "Sarah Chen",
    nickname: "SC",
    major: "Computer Science & Artificial Intelligence",
    studentCode: "STU2024001",
    email: "sarah.chen@stanford.edu",
    phone: "+1 (650) 555-0123",
    location: "Stanford, CA",
    bio: "Final year CS student specializing in AI/ML and full-stack development. Passionate about building scalable applications and contributing to open-source projects. Previously interned at Google and Microsoft. Looking to connect with mentors in the AI industry.",
    avatar: "",
    backgroundImage: "",
    isOnline: true,
    links: {
      github: "https://github.com/sarahchen-dev",
      portfolio: "https://sarahchen.dev",
      linkedin: "https://linkedin.com/in/sarahchen-ai",
    },
    stats: {
      sessionsCompleted: 47,
      totalHours: 89,
      rating: 4.9,
      mentorsWorkedWith: 12,
    },
  });

  const [editForm, setEditForm] = useState<StudentProfile>(profile);

  useEffect(() => {
    if (usernameParam) {
      setIsOwnProfile(false);
      const data = mockStudents[usernameParam];
      if (data) {
        setProfile(data);
        setEditForm(data);
      }
    } else {
      setIsOwnProfile(true);
    }
  }, [usernameParam]);

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
        <div className="relative h-80 bg-gradient-to-r from-blue-500 to-purple-600 overflow-visible">
          {profile.backgroundImage && (
            <img
              src={profile.backgroundImage}
              alt="Profile background"
              className="object-cover w-full h-full"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />

          {isOwnProfile && isEditing && (
            <div className="absolute top-4 right-4">
              <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors bg-black/50 rounded-lg cursor-pointer hover:bg-black/70 backdrop-blur-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const result = e.target?.result as string;
                        setProfile((prev) => ({
                          ...prev,
                          backgroundImage: result,
                        }));
                        setEditForm((prev) => ({
                          ...prev,
                          backgroundImage: result,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                <Edit className="w-4 h-4" />
                Change Background
              </label>
            </div>
          )}

          {/* Profile Avatar */}
          <div className="absolute bottom-0 transform -translate-x-1/2 translate-y-1/2 left-1/2 z-10">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg rounded-full overflow-hidden">
                <AvatarImage
                  src={profile.avatar}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 w-full h-full flex items-center justify-center">
                  {profile.nickname}
                </AvatarFallback>
              </Avatar>

              {isOwnProfile && isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors bg-black/70 rounded-lg cursor-pointer hover:bg-black/90 backdrop-blur-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            const result = e.target?.result as string;
                            setProfile((prev) => ({ ...prev, avatar: result }));
                            setEditForm((prev) => ({
                              ...prev,
                              avatar: result,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <Edit className="w-4 h-4" />
                    Change Photo
                  </label>
                </div>
              )}

              {/* Online Status Indicator */}
              {profile.isOnline && (
                <div className="absolute w-6 h-6 bg-green-500 border-4 border-white rounded-full bottom-2 right-2" />
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-12 mx-auto -mt-16 max-w-7xl sm:px-6 lg:px-8">
          {/* Increased gap from top */}
          <div className="pt-16"></div>

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
                        {isOwnProfile && isEditing ? (
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

                      {(!isOwnProfile || !isEditing) && (
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
              {isOwnProfile ? (
                /* Account Owner Actions */
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
              ) : (
                /* Rating and Feedback for Other Users */
                <>
                  {/* Rating Section */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                        <Star className="w-5 h-5" />
                        Rating & Reviews
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold text-primary">
                            {profile.stats.rating}
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= Math.floor(profile.stats.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ({profile.stats.sessionsCompleted} sessions)
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Based on {profile.stats.mentorsWorkedWith} mentor
                          reviews
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Feedback Section */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Leave Feedback
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Rating
                          </Label>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                                onClick={() => {
                                  // TODO: Implement rating submission
                                  console.log(`Rating: ${star}`);
                                }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Comment
                          </Label>
                          <textarea
                            placeholder="Share your experience working with this student..."
                            className="w-full p-3 mt-1 border rounded-lg resize-none min-h-[80px]"
                            rows={3}
                          />
                        </div>

                        <Button className="w-full">Submit Feedback</Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfilePage;
