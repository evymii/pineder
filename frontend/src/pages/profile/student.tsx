import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import StudentProfileCreation from "../../components/features/user-profile/StudentProfileCreation";

const StudentProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [existingData, setExistingData] = useState({});
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchProfile = async () => {
        try {
          setIsLoadingProfile(true);
          console.log(
            "Fetching profile for user:",
            user.emailAddresses[0]?.emailAddress
          );

          const response = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555"
            }/api/students/profile`,
            {
              headers: {
                "x-user-role": "student",
                "x-user-email": user.emailAddresses[0]?.emailAddress || "",
                "x-user-id": user.id,
              },
            }
          );

          console.log("Response status:", response.status);
          console.log("Response headers:", response.headers);

          if (response.ok) {
            const data = await response.json();
            console.log("Response data:", data);

            if (data.success && data.data) {
              const backendProfile = data.data;
              console.log("Backend profile:", backendProfile);

              const profileData = {
                firstName: backendProfile.firstName || "",
                lastName: backendProfile.lastName || "",
                className: backendProfile.major || "",
                studentCode: backendProfile.studentCode || "",
                email: backendProfile.email || "",
                bio: backendProfile.bio || "",
                avatar: backendProfile.avatar || "",
                backgroundImage: backendProfile.backgroundImage || "",
              };
              console.log("Profile data being set:", profileData);
              setExistingData(profileData);
              setProfileExists(true);
            } else {
              console.log("No profile data found in response");
              setProfileExists(false);
            }
          } else {
            const errorData = await response.json();
            console.log("Error response:", errorData);
            setProfileExists(false);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setProfileExists(false);
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

  // Show creation form if profile doesn't exist, edit form if it does
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <StudentProfileCreation
        isEditMode={profileExists}
        existingData={existingData}
      />
    </div>
  );
};

export default StudentProfilePage;
