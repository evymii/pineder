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
  Briefcase,
  Hash,
  Globe,
  Github,
  ExternalLink,
  MapPin,
  Star,
  DollarSign,
  Languages,
  Clock4,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

interface MentorProfile {
  fullName: string;
  title: string;
  company: string;
  employeeId: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  backgroundImage: string;
  isOnline: boolean;
  hourlyRate: number;
  currency: string;
  expertise: string[];
  languages: string[];
  links: {
    github?: string;
    portfolio?: string;
    linkedin?: string;
    website?: string;
  };
  stats: {
    sessionsCompleted: number;
    totalHours: number;
    rating: number;
    studentsMentored: number;
    yearsExperience: number;
  };
  availability: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  upcomingSessions: Session[];
  completedSessions: Session[];
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Session {
  id: string;
  studentName: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: "scheduled" | "completed" | "cancelled";
}

const MentorProfilePage: React.FC = () => {
  // This would typically come from route params or context
  const isOwnProfile = false; // TODO: Replace with actual logic based on route/user context
  const router = useRouter();
  const usernameParam = (router.query.username as string) || "";

  // Mock Mentor Data Examples (for future use with different profiles)
  /*
  const mockMentors = {
    "sarah-chen": {
      fullName: "Dr. Sarah Chen",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      employeeId: "EMP2024001",
      email: "sarah.chen@techcorp.com",
      phone: "+1 (555) 987-6543",
      location: "San Francisco, CA",
      bio: "Experienced software engineer with 8+ years in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about mentoring students and sharing industry knowledge.",
      avatar: "",
      backgroundImage: "",
      isOnline: true,
      hourlyRate: 75,
      currency: "USD",
      expertise: ["React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"],
      languages: ["English", "Mandarin", "Spanish"],
      links: {
        github: "https://github.com/sarahchen",
        portfolio: "https://sarahchen.dev",
        linkedin: "https://linkedin.com/in/sarahchen",
        website: "https://sarahchen.com",
      },
      stats: { sessionsCompleted: 156, totalHours: 312, rating: 4.9, studentsMentored: 42, yearsExperience: 8 }
    },
    "david-kim": {
      fullName: "David Kim",
      title: "Lead Data Scientist",
      company: "DataFlow Analytics",
      employeeId: "EMP2024002",
      email: "david.kim@dataflow.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      bio: "Data science leader with expertise in machine learning, statistical analysis, and big data technologies. Passionate about helping students understand complex data concepts.",
      avatar: "",
      backgroundImage: "",
      isOnline: false,
      hourlyRate: 85,
      currency: "USD",
      expertise: ["Python", "R", "TensorFlow", "PyTorch", "SQL", "Spark"],
      languages: ["English", "Korean"],
      links: {
        github: "https://github.com/davidkim-ds",
        portfolio: "https://davidkim.ai",
        linkedin: "https://linkedin.com/in/davidkim-ds",
      },
      stats: { sessionsCompleted: 89, totalHours: 178, rating: 4.8, studentsMentored: 28, yearsExperience: 6 }
    }
  };
  */

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<MentorProfile>({
    fullName: "Dr. Sarah Chen",
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    employeeId: "EMP2024001",
    email: "sarah.chen@techcorp.com",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    bio: "Experienced software engineer with 8+ years in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about mentoring students and sharing industry knowledge.",
    avatar: "",
    backgroundImage: "",
    isOnline: true,
    hourlyRate: 75,
    currency: "USD",
    expertise: ["React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"],
    languages: ["English", "Mandarin", "Spanish"],
    links: {
      github: "https://github.com/sarahchen",
      portfolio: "https://sarahchen.dev",
      linkedin: "https://linkedin.com/in/sarahchen",
      website: "https://sarahchen.com",
    },
    stats: {
      sessionsCompleted: 156,
      totalHours: 312,
      rating: 4.9,
      studentsMentored: 42,
      yearsExperience: 8,
    },
    availability: {
      monday: [
        { id: "1", startTime: "09:00", endTime: "12:00", isAvailable: true },
        { id: "2", startTime: "14:00", endTime: "17:00", isAvailable: true },
        { id: "3", startTime: "19:00", endTime: "21:00", isAvailable: false },
      ],
      tuesday: [
        { id: "4", startTime: "09:00", endTime: "12:00", isAvailable: true },
        { id: "5", startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
      wednesday: [
        { id: "6", startTime: "09:00", endTime: "12:00", isAvailable: true },
        { id: "7", startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
      thursday: [
        { id: "8", startTime: "09:00", endTime: "12:00", isAvailable: true },
        { id: "9", startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
      friday: [
        { id: "10", startTime: "09:00", endTime: "12:00", isAvailable: true },
        { id: "11", startTime: "14:00", endTime: "17:00", isAvailable: false },
      ],
      saturday: [
        { id: "12", startTime: "10:00", endTime: "14:00", isAvailable: true },
      ],
      sunday: [],
    },
    upcomingSessions: [
      {
        id: "1",
        studentName: "Alex Johnson",
        date: "2024-01-15",
        time: "14:00",
        duration: 60,
        topic: "React State Management",
        status: "scheduled",
      },
      {
        id: "2",
        studentName: "Maria Garcia",
        date: "2024-01-16",
        time: "10:00",
        duration: 90,
        topic: "Node.js Backend Development",
        status: "scheduled",
      },
    ],
    completedSessions: [
      {
        id: "3",
        studentName: "John Smith",
        date: "2024-01-10",
        time: "15:00",
        duration: 60,
        topic: "Python Data Structures",
        status: "completed",
      },
    ],
  });

  useEffect(() => {
    if (usernameParam) {
      // When viewing a specific mentor by username, assume visitor view
      // In a real app, fetch mentor by username here
    }
  }, [usernameParam]);

  const [editForm, setEditForm] = useState<MentorProfile>(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleInputChange = (
    field: keyof MentorProfile,
    value: string | number | string[]
  ) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLinkChange = (
    platform: keyof MentorProfile["links"],
    value: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      links: { ...prev.links, [platform]: value },
    }));
  };

  const handleTimeSlotToggle = (
    day: keyof MentorProfile["availability"],
    slotId: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].map((slot) =>
          slot.id === slotId
            ? { ...slot, isAvailable: !slot.isAvailable }
            : slot
        ),
      },
    }));
  };

  const addTimeSlot = (day: keyof MentorProfile["availability"]) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true,
    };

    setEditForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: [...prev.availability[day], newSlot],
      },
    }));
  };

  const removeTimeSlot = (
    day: keyof MentorProfile["availability"],
    slotId: string
  ) => {
    setEditForm((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day].filter((slot) => slot.id !== slotId),
      },
    }));
  };

  const getDayName = (day: string) => {
    const dayNames: { [key: string]: string } = {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    };
    return dayNames[day] || day;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Profile Banner */}
        <div className="relative h-80 bg-gradient-to-r from-green-500 to-blue-600 overflow-hidden">
          <img
            src={profile.backgroundImage}
            alt="Profile background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Profile Avatar */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.fullName} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 text-white">
                  {profile.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Online Status Indicator */}
              {profile.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {isEditing ? (
                          <Input
                            value={editForm.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            className="text-3xl font-bold text-center lg:text-left border-0 p-0 bg-transparent"
                          />
                        ) : (
                          profile.fullName
                        )}
                      </h1>

                      {!isEditing && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-lg text-muted-foreground mb-4"
                        >
                          {profile.title} at {profile.company}
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
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
                          {profile.stats.studentsMentored}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Students
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile.stats.yearsExperience}y
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Experience
                        </div>
                      </div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="mt-6 text-center lg:text-left">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        <DollarSign className="w-4 h-4 mr-2" />
                        {profile.hourlyRate} {profile.currency}/hour
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Title
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-foreground flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {profile.title}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Company
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-foreground flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {profile.company}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Employee ID
                        </Label>
                        {isEditing ? (
                          <Input
                            value={editForm.employeeId}
                            onChange={(e) =>
                              handleInputChange("employeeId", e.target.value)
                            }
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-foreground flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            {profile.employeeId}
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
                          <div className="mt-1 text-foreground flex items-center gap-2">
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
                          <div className="mt-1 text-foreground flex items-center gap-2">
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
                          <div className="mt-1 text-foreground flex items-center gap-2">
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
                          className="mt-1 w-full p-3 border rounded-lg resize-none"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-foreground">{profile.bio}</p>
                      )}
                    </div>

                    {/* Expertise */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Areas of Expertise
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Languages
                      </Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.languages.map((language, index) => (
                          <Badge key={index} variant="secondary">
                            <Languages className="w-3 h-3 mr-1" />
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability Management */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Clock4 className="w-5 h-5" />
                    Free Time & Availability
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(profile.availability).map(
                      ([day, slots]) => (
                        <div key={day} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-foreground">
                              {getDayName(day)}
                            </h3>
                            {isEditing && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  addTimeSlot(
                                    day as keyof MentorProfile["availability"]
                                  )
                                }
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Slot
                              </Button>
                            )}
                          </div>

                          {slots.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                              No availability set
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {slots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className="flex items-center gap-3 p-2 border rounded"
                                >
                                  <div className="flex-1">
                                    <span className="text-sm font-medium">
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                  </div>

                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant={
                                          slot.isAvailable
                                            ? "default"
                                            : "outline"
                                        }
                                        onClick={() =>
                                          handleTimeSlotToggle(
                                            day as keyof MentorProfile["availability"],
                                            slot.id
                                          )
                                        }
                                      >
                                        {slot.isAvailable ? (
                                          <>
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Available
                                          </>
                                        ) : (
                                          <>
                                            <XCircle className="w-4 h-4 mr-1" />
                                            Unavailable
                                          </>
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          removeTimeSlot(
                                            day as keyof MentorProfile["availability"],
                                            slot.id
                                          )
                                        }
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Badge
                                      variant={
                                        slot.isAvailable
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {slot.isAvailable
                                        ? "Available"
                                        : "Unavailable"}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Links, Actions, and Sessions */}
            <div className="space-y-6">
              {/* Links Section */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Professional Links
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
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">
                            Website
                          </Label>
                          <Input
                            value={editForm.links.website || ""}
                            onChange={(e) =>
                              handleLinkChange("website", e.target.value)
                            }
                            placeholder="https://yourwebsite.com"
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
                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
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
                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
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
                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                in
                              </span>
                            </div>
                            <span>LinkedIn</span>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                        {profile.links.website && (
                          <a
                            href={profile.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                            <span>Website</span>
                            <ExternalLink className="w-4 h-4 ml-auto" />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock4 className="w-5 h-5" />
                    Upcoming Sessions
                  </h3>

                  <div className="space-y-3">
                    {profile.upcomingSessions.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No upcoming sessions
                      </p>
                    ) : (
                      profile.upcomingSessions.map((session) => (
                        <div key={session.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Link
                              href={`/profile/student?username=${session.studentName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")}`}
                              className="font-medium text-foreground hover:text-accent"
                            >
                              {session.studentName}
                            </Link>
                            <Badge variant="outline">{session.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>
                              {session.date} at {session.time}
                            </div>
                            <div>
                              {session.duration} minutes • {session.topic}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Owner Actions */}
              {isOwnProfile ? (
                /* Account Owner Actions */
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">
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
                          Based on {profile.stats.studentsMentored} student
                          reviews
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="text-center p-3 bg-accent/20 rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              {profile.stats.yearsExperience}+
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Years Experience
                            </div>
                          </div>
                          <div className="text-center p-3 bg-accent/20 rounded-lg">
                            <div className="text-lg font-bold text-primary">
                              ${profile.hourlyRate}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Per Hour
                            </div>
                          </div>
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
                            placeholder="Share your experience working with this mentor..."
                            className="w-full p-3 mt-1 border rounded-lg resize-none min-h-[80px]"
                            rows={3}
                          />
                        </div>

                        <Button className="w-full">Submit Feedback</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Book Session Section */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="mb-4 text-lg font-semibold">
                        Book a Session
                      </h3>

                      <div className="space-y-3">
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">
                            ${profile.hourlyRate}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per hour
                          </div>
                        </div>

                        <Button className="w-full">Schedule Session</Button>

                        <div className="text-xs text-center text-muted-foreground">
                          Available in {profile.languages.join(", ")}
                        </div>
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

export default MentorProfilePage;
