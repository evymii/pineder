import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

export function PostSignInRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { getUserRole, getRedirectPath } = useEmailRouting();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by only running on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this effect on client and once when user first signs in
    if (!isClient || !isLoaded || !isSignedIn || !user || hasRedirected) return;

    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) return;

    const userRole = getUserRole(primaryEmail);

    // For now, let's add a simple check to prevent redirecting if user is already on a valid page
    // This prevents the redirect loop when users want to stay on homepage
    const currentPath = router.pathname;
    const isOnValidPage =
      currentPath === "/" ||
      currentPath === "/dashboard" ||
      currentPath === "/user/dashboard" ||
      currentPath === "/user/student-dashboard" ||
      currentPath === "/user/mentor-dashboard" ||
      currentPath.startsWith("/profile/");

    if (isOnValidPage) {
      // User is already on a valid page, don't redirect
      console.log("User is on valid page, not redirecting");
      setHasRedirected(true);
      return;
    }

    // Only redirect to profile creation if user is not on a valid page
    console.log("Redirecting to profile creation page");
    const redirectPath = getRedirectPath(userRole);
    router.push(redirectPath);
    setHasRedirected(true);
  }, [
    isClient,
    isLoaded,
    isSignedIn,
    user,
    hasRedirected,
    getUserRole,
    getRedirectPath,
    router,
  ]);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) return null;

  return null;
}
