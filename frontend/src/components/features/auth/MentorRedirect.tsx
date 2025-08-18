import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

export function MentorRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { userRole } = useEmailRouting();

  useEffect(() => {
    // If user is a mentor and not on their dashboard, redirect immediately
    if (
      isLoaded &&
      isSignedIn &&
      userRole === "mentor" &&
      router.pathname !== "/mentor-dashboard"
    ) {
      router.push("/mentor-dashboard");
    }
  }, [isLoaded, isSignedIn, userRole, router]);

  return null;
}
