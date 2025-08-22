import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface Mentor {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    title: string;
    bio: string;
  };
  specialties: string[];
  experience: number;
  rating: number;
  hourlyRate: number;
  totalSessions: number;
  totalStudents: number;
  isVerified: boolean;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
}

interface UseMentorsReturn {
  mentors: Mentor[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMentors = (): UseMentorsReturn => {
  const { user } = useUser();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authentication headers if user is logged in
      if (user) {
        headers["x-user-role"] =
          (user.publicMetadata?.role as string) || "student";
        headers["x-user-email"] = user.emailAddresses[0]?.emailAddress || "";
        headers["x-user-id"] = user.id || "";
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/mentors?limit=10`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        if (data.success && data.data) {
          // Filter out mentors with null userId and map the data correctly
          const validMentors = data.data.mentors
            .filter((mentor: any) => mentor.userId !== null)
            .map((mentor: any) => ({
              _id: mentor._id,
              userId: {
                firstName: mentor.userId.firstName || "Unknown",
                lastName: mentor.userId.lastName || "Mentor",
                email: mentor.userId.email || "",
                avatar: mentor.userId.avatar || "",
                title: mentor.userId.title || "Mentor",
                bio: mentor.bio || mentor.userId.bio || "No bio available",
              },
              specialties: mentor.specialties || [],
              experience: mentor.experience || 0,
              rating: mentor.rating || 0,
              hourlyRate: mentor.hourlyRate || 0,
              totalSessions: mentor.totalSessions || 0,
              totalStudents: mentor.totalStudents || 0,
              isVerified: mentor.isVerified || false,
              availability: mentor.availability || [],
            }));

          console.log("Processed mentors:", validMentors);
          setMentors(validMentors);
        } else {
          throw new Error(data.message || "Failed to fetch mentors");
        }
      } else {
        throw new Error("Failed to fetch mentors");
      }
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch mentors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [user]);

  const refetch = () => {
    fetchMentors();
  };

  return {
    mentors,
    isLoading,
    error,
    refetch,
  };
};
