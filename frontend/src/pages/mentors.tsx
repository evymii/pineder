import Head from "next/head";
import { useState } from "react";
import { useTheme } from "../core/contexts/ThemeContext";
import { TeacherCategory } from "../components/features/mentors/TeacherCategory";
import { SessionBookingDialog } from "../components/features/mentors/SessionBookingDialog";
import { SuccessNotification } from "../design/system/success-notification";
import { Layout } from "../components/layout/Layout";
import { useMentors, Mentor } from "../core/hooks/useMentors";
import { useSessionBooking } from "../core/hooks/useSessionBooking";

const MentorsPage = () => {
  const { isDarkMode, colors } = useTheme();
  const { mentors, isLoading, error } = useMentors();

  // Debug logging
  console.log("Mentors page - mentors:", mentors);
  console.log("Mentors page - mentors.length:", mentors.length);
  console.log("Mentors page - isLoading:", isLoading);
  console.log("Mentors page - error:", error);

  // Test if mentors array is working
  if (mentors.length > 0) {
    console.log("First mentor:", mentors[0]);
  }
  const { bookSession, isLoading: isBooking } = useSessionBooking();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleTeacherClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = async (sessionData: any) => {
    if (!selectedMentor) return;

    // Parse the startTime to get date and time
    const startDate = new Date(sessionData.startTime);
    const date = startDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    const time = startDate.toTimeString().split(" ")[0]; // HH:MM:SS format

    const bookingData = {
      mentorId: selectedMentor._id,
      topic: sessionData.topic,
      date: date,
      time: time,
      studentChoice: "free", // Default choice
      requestNotes: sessionData.message,
    };

    console.log("Sending booking data:", bookingData);

    const result = await bookSession(bookingData);

    setShowBookingDialog(false);
    setNotificationMessage(result.message);
    setShowSuccessNotification(true);

    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <Head>
          <title>Find Your Perfect Mentor | Pineder</title>
        </Head>
        <div
          className="flex items-center justify-center min-h-screen pt-24"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading mentors...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <Head>
          <title>Find Your Perfect Mentor | Pineder</title>
        </Head>
        <div
          className="flex items-center justify-center min-h-screen pt-24"
          style={{ backgroundColor: colors.background.primary }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Error Loading Mentors
            </h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Find Your Perfect Mentor | Pineder</title>
        <meta
          name="description"
          content="Find your perfect mentor on Pineder - Connect with experienced professionals to accelerate your growth."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-h-screen pt-24"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h1
              className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
              style={{ color: colors.text.primary }}
            >
              Find Your Perfect
              <span className="block text-[#08CB00]">Mentor</span>
            </h1>
            <p
              className="max-w-2xl mx-auto text-lg"
              style={{ color: colors.text.secondary }}
            >
              Connect with experienced professionals who can guide you on your
              journey to success.
            </p>
          </div>

          <div className="w-full">
            {/* Full Width Mentor Categories */}
            <div className="w-full">
              <div
                className="w-full p-6 transition-all duration-200 border-0 shadow-lg rounded-3xl"
                style={{
                  backgroundColor: isDarkMode
                    ? colors.background.tertiary
                    : colors.background.primary,
                  border: `1px solid ${
                    isDarkMode ? colors.border.primary : colors.border.secondary
                  }`,
                }}
              >
                <div className="space-y-8">
                  {/* Original horizontal scrollable mentor cards */}
                  {mentors.length > 0 ? (
                    <div className="space-y-6">
                      <h2
                        className="mb-8 text-2xl font-bold text-center"
                        style={{ color: colors.text.primary }}
                      >
                        Software Engineer Mentors
                      </h2>
                      <div className="flex gap-6 pb-4 overflow-x-auto">
                        {mentors.map((mentor) => (
                          <div
                            key={mentor._id}
                            className="flex-shrink-0 p-4 transition-all duration-200 bg-white rounded-lg shadow-md cursor-pointer w-72 hover:shadow-lg"
                            onClick={() => handleTeacherClick(mentor)}
                          >
                            {/* Profile Image */}
                            <div className="flex justify-center mb-3">
                              <div className="w-16 h-16 overflow-hidden rounded-full">
                                {mentor.userId.avatar ? (
                                  <img
                                    src={mentor.userId.avatar}
                                    alt={`${mentor.userId.firstName} ${mentor.userId.lastName}`}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-500 to-blue-600">
                                    <span className="text-lg font-semibold text-white">
                                      {mentor.userId.firstName[0]}
                                      {mentor.userId.lastName[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Name */}
                            <h3 className="mb-2 text-base font-bold text-center text-gray-900">
                              {mentor.userId.firstName} {mentor.userId.lastName}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center justify-center mb-2">
                              <span className="mr-1 text-yellow-500">★</span>
                              <span className="text-sm font-semibold text-gray-900">
                                {mentor.rating.toFixed(1)}
                              </span>
                            </div>

                            {/* Specialties */}
                            <div className="flex flex-col items-center gap-1 mb-4">
                              {mentor.specialties
                                .slice(0, 2)
                                .map((specialty, index) => (
                                  <span
                                    key={index}
                                    className="text-xs font-medium text-green-600"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                            </div>

                            {/* Book Session Button */}
                            <button
                              className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookSession(mentor);
                              }}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              Book Session
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-600 dark:text-gray-400">
                        No Mentors Available
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Check back later for available mentors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Booking Dialog */}
      {showBookingDialog && selectedMentor && (
        <SessionBookingDialog
          mentor={selectedMentor}
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          isVisible={showSuccessNotification}
          message={notificationMessage}
          onClose={() => setShowSuccessNotification(false)}
        />
      )}
    </Layout>
  );
};

export default MentorsPage;
