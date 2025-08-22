import { Card } from "../../../design/system/card";
import { Avatar, AvatarFallback } from "../../../design/system/avatar";
import { Star, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../../common/figma/ImageWithFallback";
import { Mentor } from "../../../core/lib/data/mentors";
import { Button } from "../../../design/system/button";
import { useTheme } from "../../../core/contexts/ThemeContext";

interface TeacherCardProps {
  mentor: Mentor;
  isDarkMode: boolean;
  onClick: (mentor: Mentor) => void;
  onBookSession: (mentor: Mentor) => void;
}

export function TeacherCard({
  mentor,
  isDarkMode,
  onClick,
  onBookSession,
}: TeacherCardProps) {
  const { colors } = useTheme();

  const bookSession = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookSession(mentor);
  };

  return (
    <div
      className="relative cursor-pointer group w-full"
      onClick={() => onClick(mentor)}
    >
      <Card
        className="h-80 p-4 border-0 shadow-md rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 w-full overflow-hidden"
        style={{
          backgroundColor: isDarkMode
            ? colors.background.tertiary
            : colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="h-full flex flex-col">
          {/* Top section with avatar and basic info */}
          <div className="space-y-3 flex-shrink-0">
            <div className="relative mx-auto">
              <Avatar className="w-16 h-16 mx-auto ring-2 ring-offset-2 ring-[#08CB00]/20">
                <ImageWithFallback
                                                                  src={mentor.image}
                        alt={mentor.name}
                  className="object-cover"
                />
                <AvatarFallback
                  className="text-base text-white"
                  style={{
                    background: "#08CB00",
                  }}
                >
                  {mentor.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1.5">
              <h4
                className="text-base font-semibold text-center leading-tight whitespace-nowrap overflow-hidden"
                style={{ color: colors.text.primary }}
              >
                {mentor.name}
              </h4>
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span
                  className="text-base font-medium"
                  style={{ color: colors.text.primary }}
                >
                  {mentor.rating}
                </span>
              </div>
            </div>

            {/* Expertise Fields - Exactly 2 rows with 2 best fields */}
            <div className="flex flex-col space-y-1.5 max-w-full">
              {/* First row - first best field */}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div
                  className="inline-block px-3 py-1 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200"
                  style={{ color: "#08CB00" }}
                >
                  {mentor.expertise[0]}
                </div>
              )}

              {/* Second row - second best field */}
              {mentor.expertise && mentor.expertise.length > 1 && (
                <div
                  className="inline-block px-3 py-1 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200"
                  style={{ color: "#08CB00" }}
                >
                  {mentor.expertise[1]}
                </div>
              )}
            </div>
          </div>

          {/* Book Session Button - positioned directly under fields */}
          <div className="mt-4">
            <Button
              onClick={bookSession}
              className="w-full text-white transition-all duration-200 font-medium py-2.5 rounded-lg text-base shadow-lg hover:shadow-xl"
              style={{
                background: "#08CB00",
                color: colors.text.inverse,
              }}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Book Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
