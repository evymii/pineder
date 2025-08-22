import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Session {
  _id: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
    grade: string;
    subjects: string[];
  };
  topic: string;
  startTime: string;
  endTime: string;
  status: "requested" | "approved" | "scheduled" | "completed" | "cancelled";
  duration: number;
  createdAt: string;
}

interface SessionRequest {
  _id: string;
  studentId: {
    userId: {
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
    grade: string;
    subjects: string[];
  };
  topic: string;
  startTime: string;
  endTime: string;
  status: "requested";
  duration: number;
  createdAt: string;
  message?: string;
}

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  totalSessions: number;
  completedSessions: number;
  progressPercentage: number;
  lastSession: string;
}

interface Analytics {
  totalSessions: number;
  completedSessions: number;
  totalStudents: number;
  averageRating: number;
  sessionHours: number;
  pendingRequests: number;
}

interface DashboardData {
  sessions: Session[];
  sessionRequests: SessionRequest[];
  students: Student[];
  analytics: Analytics;
  isLoading: boolean;
  error: string | null;
}

export const useMentorDashboard = (): DashboardData => {
  const { user } = useUser();
  const [data, setData] = useState<DashboardData>({
    sessions: [],
    sessionRequests: [],
    students: [],
    analytics: {
      totalSessions: 0,
      completedSessions: 0,
      totalStudents: 0,
      averageRating: 0,
      sessionHours: 0,
      pendingRequests: 0,
    },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true, error: null }));

        const headers = {
          "x-user-role": "mentor",
          "x-user-email": user.emailAddresses[0]?.emailAddress || "",
          "x-user-id": user.id || "",
        };

        // Fetch all data in parallel
        const [overviewRes, sessionsRes, requestsRes, studentsRes] =
          await Promise.all([
            fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/mentor-dashboard/overview`,
              { headers }
            ),
            fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/mentor-dashboard/upcoming-sessions`,
              { headers }
            ),
            fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/mentor-dashboard/session-requests`,
              { headers }
            ),
            fetch(
              `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
              }/api/mentor-dashboard/recent-students`,
              { headers }
            ),
          ]);

        // Process overview data
        let analytics = {
          totalSessions: 0,
          completedSessions: 0,
          totalStudents: 0,
          averageRating: 0,
          sessionHours: 0,
          pendingRequests: 0,
        };

        if (overviewRes.ok) {
          const overviewData = await overviewRes.json();
          if (overviewData.success && overviewData.data) {
            analytics = {
              totalSessions: overviewData.data.overview?.totalSessions || 0,
              completedSessions:
                overviewData.data.performance?.completedSessions || 0,
              totalStudents: overviewData.data.overview?.activeStudents || 0,
              averageRating: overviewData.data.overview?.averageRating || 0,
              sessionHours: overviewData.data.performance?.thisMonthHours || 0,
              pendingRequests: overviewData.data.overview?.pendingRequests || 0,
            };
          }
        }

        // Process sessions data
        let sessions: Session[] = [];
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          if (sessionsData.success && sessionsData.data) {
            sessions = sessionsData.data.sessions || [];
          }
        }

        // Process session requests data
        let sessionRequests: SessionRequest[] = [];
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          if (requestsData.success && requestsData.data) {
            sessionRequests = requestsData.data.requests || [];
          }
        }

        // Process students data
        let students: Student[] = [];
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          if (studentsData.success && studentsData.data) {
            students = studentsData.data.students || [];
          }
        }

        setData({
          sessions,
          sessionRequests,
          students,
          analytics,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load dashboard data",
        }));
      }
    };

    fetchDashboardData();
  }, [user]);

  return data;
};
