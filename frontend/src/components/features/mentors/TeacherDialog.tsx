import { Avatar, AvatarFallback } from "../../../design/system/avatar";
import { Button } from "../../../design/system/button";
import { Badge } from "../../../design/system/badge";
import { ImageWithFallback } from "../../common/figma/ImageWithFallback";
import { Star, MapPin, Clock, Calendar, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../design/system/dialog";
import { Mentor } from "../../../core/lib/data/mentors";

interface TeacherDialogProps {
  mentor: Mentor | null;
  isOpen: boolean;
  isDarkMode: boolean;
  onClose: () => void;
  onBooking: (mentor: Mentor, timeSlot: string) => void;
}

export function TeacherDialog({
  mentor,
  isOpen,
  isDarkMode,
  onClose,
  onBooking,
}: TeacherDialogProps) {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const mutedTextColor = isDarkMode ? "text-gray-300" : "text-gray-600";

  if (!mentor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`max-w-2xl ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 border-slate-600/50"
            : "bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 border-slate-200/50"
        } shadow-2xl backdrop-blur-sm`}
      >
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16 ring-4 ring-offset-2 ring-blue-500/20">
              <ImageWithFallback
                src={mentor.image}
                alt={mentor.name}
                className="object-cover"
              />
              <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {mentor.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle
                className={`text-2xl font-bold ${textColor} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                {mentor.name}
              </DialogTitle>
              <DialogDescription className={`text-lg ${mutedTextColor}`}>
                {mentor.role} at {mentor.company}
              </DialogDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm ${mutedTextColor}`}>
                  {mentor.rating} ({mentor.sessions} sessions)
                </span>
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className={`text-sm ${mutedTextColor}`}>
                  {mentor.location}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* About Section */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white/60 border border-slate-200/50"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>About</h3>
            <p className={`text-sm ${mutedTextColor}`}>{mentor.about}</p>
          </div>

          {/* Expertise */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white/60 border border-slate-200/50"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-3 ${textColor} flex items-center`}
            >
              <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={`text-xs px-3 py-1 rounded-full border ${
                    isDarkMode
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-200 border-blue-500/30 hover:from-blue-600/30 hover:to-purple-600/30"
                      : "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-300 hover:from-blue-100 hover:to-purple-100"
                  } transition-all duration-200`}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Available Times */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode
                ? "bg-slate-800/50 border border-slate-700/50"
                : "bg-white/60 border border-slate-200/50"
            }`}
          >
            <h3 className={`text-lg font-semibold mb-3 ${textColor}`}>
              <Clock className="inline w-4 h-4 mr-2 text-green-500" />
              Available Booking Times
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {mentor.availableTimes.map((time: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start transition-all duration-200 ${
                    isDarkMode
                      ? "border-blue-500/30 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-200"
                      : "border-blue-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700"
                  }`}
                  onClick={() => onBooking(mentor, time)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className={`transition-all duration-200 ${
              isDarkMode
                ? "border-slate-600 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-500"
                : "border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400"
            }`}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
