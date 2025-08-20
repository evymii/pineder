import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  X,
  Share2,
  Bookmark,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../../design/system/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../design/system/card";
import { Badge } from "../../../design/system/badge";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface EventDetailsProps {
  event: {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    date: Date;
    endDate: Date;
    type: string;
    status: string;
    icon: any;
    description: string;
    location: string;
    attendees: number;
    category: string;
    color: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetails({ event, isOpen, onClose }: EventDetailsProps) {
  const { colors, isDarkMode } = useTheme();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return colors.accent.success;
      case "almost full":
        return colors.accent.warning;
      case "full":
        return colors.accent.error;
      default:
        return colors.accent.primary;
    }
  };

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${event.color} text-white`}>
                    <event.icon className="w-8 h-8" />
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {event.type}
                      </Badge>
                      <Badge
                        style={{
                          backgroundColor: getStatusColor(event.status),
                          color: colors.text.inverse,
                        }}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-10 w-10 p-0 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar
                      className="w-5 h-5"
                      style={{ color: colors.accent.primary }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Date
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock
                      className="w-5 h-5"
                      style={{ color: colors.accent.primary }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Time
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: colors.accent.primary }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Location
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {event.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0 shadow-sm"
                style={{
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users
                      className="w-5 h-5"
                      style={{ color: colors.accent.primary }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        Attendees
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {event.attendees} registered
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card
              className="mb-6 border-0 shadow-sm"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle
                  className="text-lg"
                  style={{ color: colors.text.primary }}
                >
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Category and Additional Info */}
            <Card
              className="mb-6 border-0 shadow-sm"
              style={{
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.text.primary }}
                    >
                      Category
                    </p>
                    <Badge
                      style={{
                        backgroundColor: `${colors.accent.primary}20`,
                        color: colors.accent.primary,
                      }}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.text.primary }}
                    >
                      Event ID
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      #{event.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div
            className="border-t p-4"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className="transition-all duration-200"
                  style={{
                    borderColor: colors.border.primary,
                    color: isBookmarked
                      ? colors.accent.primary
                      : colors.text.secondary,
                    backgroundColor: isBookmarked
                      ? `${colors.accent.primary}10`
                      : "transparent",
                  }}
                >
                  <Bookmark
                    className={`w-4 h-4 mr-2 ${
                      isBookmarked ? "fill-current" : ""
                    }`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="transition-all duration-200"
                    style={{
                      borderColor: colors.border.primary,
                      color: colors.text.secondary,
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleRegister}
                className="px-6 py-2 transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: isRegistered
                    ? colors.accent.error
                    : colors.accent.success,
                  color: colors.text.inverse,
                }}
              >
                {isRegistered ? (
                  <>
                    <Minus className="w-4 h-4 mr-2" />
                    Unregister
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Register
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
