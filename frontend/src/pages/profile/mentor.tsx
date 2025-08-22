import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import MentorProfileCreation from "../../components/features/user-profile/MentorProfileCreation";

const MentorProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [existingData, setExistingData] = useState({});

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchProfile = async () => {
        try {
          setIsLoadingProfile(true);
          console.log(
            "Fetching mentor profile for user:",
            user.emailAddresses[0]?.emailAddress
          );

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
            }/api/mentors/profile`,
            {
              headers: {
                "x-user-role": "mentor",
                "x-user-email": user.emailAddresses[0]?.emailAddress || "",
                "x-user-id": user.id,
              },
            }
          );

          console.log("Mentor response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Mentor response data:", data);

            if (data.success && data.data) {
              const backendProfile = data.data;
              console.log(
                "Mentor backend profile:",
                JSON.stringify(backendProfile, null, 2)
              );

              const profileData = {
                firstName:
                  backendProfile.userId?.firstName ||
                  backendProfile.firstName ||
                  "",
                lastName:
                  backendProfile.userId?.lastName ||
                  backendProfile.lastName ||
                  "",
                title:
                  backendProfile.userId?.title || backendProfile.title || "",
                email:
                  backendProfile.userId?.email || backendProfile.email || "",
                bio: backendProfile.userId?.bio || backendProfile.bio || "",
                avatar:
                  backendProfile.userId?.avatar || backendProfile.avatar || "",
                backgroundImage:
                  backendProfile.userId?.backgroundImage ||
                  backendProfile.backgroundImage ||
                  "",
                specialties: backendProfile.specialties || [],
              };
              console.log("Mentor profile data being set:", profileData);
              setExistingData(profileData);
            } else {
              console.log("No mentor profile data found in response");
            }
          } else {
            const errorData = await response.json();
            console.log("Mentor error response:", errorData);
          }
        } catch (error) {
          console.error("Error fetching mentor profile:", error);
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [isSignedIn, user]);

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Always show the creation form style, but in edit mode
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <MentorProfileCreation
        isEditMode={Object.keys(existingData).length > 0}
        existingData={existingData}
      />
    </div>
  );
};

export default MentorProfilePage;
