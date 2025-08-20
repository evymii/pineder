import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

export function MentorRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { userRole } = useEmailRouting();

  useEffect(() => {
    // Allow mentors to stay on any page they visit, no automatic redirects
    // This component is kept for potential future redirect logic if needed
    // Currently, mentors can freely navigate to home page or any other page
  }, [isLoaded, isSignedIn, userRole, router]);

  return null;
}
