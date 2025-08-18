import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";

export function PostSignInRedirect() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { getUserRole, getRedirectPath } = useEmailRouting();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only run this effect once when user first signs in
    if (!isLoaded || !isSignedIn || !user || hasRedirected) return;

    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    if (!primaryEmail) return;

    const userRole = getUserRole(primaryEmail);
    const redirectPath = getRedirectPath(userRole);

    // Only redirect if we're on the sign-in page
    // Don't redirect from homepage to avoid loops
    if (router.pathname === "/sign-in") {
      // Add a small delay to ensure the user sees the sign-in success
      setTimeout(() => {
        router.push(redirectPath);
        setHasRedirected(true);
      }, 1000);
    }
  }, [
    isLoaded,
    isSignedIn,
    user,
    hasRedirected,
    getUserRole,
    getRedirectPath,
    router,
  ]);

  return null;
}
