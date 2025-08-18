import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

export type UserRole = "student" | "mentor" | "other";

export interface EmailRoutingConfig {
  studentDomains: string[];
  mentorDomains: string[];
  studentRedirectPath: string;
  mentorRedirectPath: string;
  otherRedirectPath: string;
}

const defaultConfig: EmailRoutingConfig = {
  studentDomains: ["@nest.edu.mn"],
  mentorDomains: ["@gmail.com"],
  studentRedirectPath: "/",
  mentorRedirectPath: "/mentor-dashboard",
  otherRedirectPath: "/", // Fallback for other email domains
};

export function useEmailRouting(config: EmailRoutingConfig = defaultConfig) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const getUserRole = (email: string): UserRole => {
    const emailLower = email.toLowerCase();

    if (
      config.studentDomains.some((domain) =>
        emailLower.endsWith(domain.toLowerCase())
      )
    ) {
      return "student";
    }

    if (
      config.mentorDomains.some((domain) =>
        emailLower.endsWith(domain.toLowerCase())
      )
    ) {
      return "mentor";
    }

    return "other";
  };

  const getRedirectPath = (role: UserRole): string => {
    switch (role) {
      case "student":
        return config.studentRedirectPath;
      case "mentor":
        return config.mentorRedirectPath;
      case "other":
        return config.otherRedirectPath;
      default:
        return config.otherRedirectPath;
    }
  };

  const redirectBasedOnEmail = () => {
    if (!isSignedIn || !user || !isLoaded) return;

    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) return;

    const userRole = getUserRole(primaryEmail);
    const redirectPath = getRedirectPath(userRole);

    // For mentors, redirect to dashboard on any page except their dashboard
    if (userRole === "mentor" && router.pathname !== "/mentor-dashboard") {
      router.push("/mentor-dashboard");
      return;
    }

    // For students and others, only redirect if we're not already on the correct path
    // Also exclude dashboard and auth-test pages from automatic redirects
    if (
      router.pathname !== redirectPath &&
      router.pathname !== "/dashboard" &&
      router.pathname !== "/auth-test" &&
      router.pathname !== "/student-dashboard"
    ) {
      router.push(redirectPath);
    }
  };

  const getUserRoleFromEmail = (): UserRole | null => {
    if (!user?.primaryEmailAddress?.emailAddress) return null;
    return getUserRole(user.primaryEmailAddress.emailAddress);
  };

  const isStudent = (): boolean => getUserRoleFromEmail() === "student";
  const isMentor = (): boolean => getUserRoleFromEmail() === "mentor";
  const isOther = (): boolean => getUserRoleFromEmail() === "other";

  return {
    userRole: getUserRoleFromEmail(),
    isStudent: isStudent(),
    isMentor: isMentor(),
    isOther: isOther(),
    redirectBasedOnEmail,
    getUserRole,
    getRedirectPath,
  };
}
