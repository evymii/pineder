import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export interface SessionBookingData {
  mentorId: string;
  topic: string;
  date: string;
  time: string;
  studentChoice: string;
  requestNotes?: string;
  // Legacy fields for backward compatibility
  startTime?: string;
  endTime?: string;
  message?: string;
}

export interface SessionRequest {
  _id: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  mentorId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  topic: string;
  startTime: string;
  endTime: string;
  status: "requested" | "approved" | "denied" | "completed" | "cancelled";
  message?: string;
  createdAt: string;
  zoomMeetingUrl?: string;
}

interface UseSessionBookingReturn {
  bookSession: (
    data: SessionBookingData
  ) => Promise<{ success: boolean; message: string }>;
  acceptSession: (
    sessionId: string
  ) => Promise<{ success: boolean; message: string }>;
  denySession: (
    sessionId: string,
    reason?: string
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  error: string | null;
}

export const useSessionBooking = (): UseSessionBookingReturn => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    // Determine role based on email domain
    const email = user?.emailAddresses[0]?.emailAddress || "";
    let role = "student"; // default
    if (email.endsWith("@gmail.com")) {
      role = "mentor";
    } else if (email.endsWith("@nest.edu.mn")) {
      role = "student";
    }
    
    return {
      "Content-Type": "application/json",
      "x-user-role": role,
      "x-user-email": email,
      "x-user-id": user?.id || "",
    };
  };

  const bookSession = async (
    data: SessionBookingData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/book`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("Booking response:", result);
      console.log("Response status:", response.status);

      if (response.ok && result.success) {
        return { success: true, message: "Session request sent successfully!" };
      } else {
        throw new Error(
          result.message || result.error || "Failed to book session"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to book session";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const acceptSession = async (
    sessionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/approve`,
        {
          method: "POST",
          headers: getHeaders(),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        return {
          success: true,
          message: "Session accepted! Zoom meeting created.",
        };
      } else {
        throw new Error(result.message || "Failed to accept session");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to accept session";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const denySession = async (
    sessionId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
        }/api/sessions/${sessionId}/reject`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ reason }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: "Session request denied." };
      } else {
        throw new Error(result.message || "Failed to deny session");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deny session";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookSession,
    acceptSession,
    denySession,
    isLoading,
    error,
  };
};
