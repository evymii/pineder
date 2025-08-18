import Head from "next/head";
import { useState } from "react";
import { useTheme } from "../core/contexts/ThemeContext";
import { mentorCategories } from "../core/lib/data/mentors";
import { TeacherCategory } from "../components/features/mentors/TeacherCategory";
import { Mentor } from "../core/lib/data/mentors";
import { SessionBookingDialog } from "../components/features/mentors/SessionBookingDialog";
import { SuccessNotification } from "../design/system/success-notification";
import { Layout } from "../components/layout/Layout";

const MentorsPage = () => {
  const { isDarkMode, colors } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(4); // Default to Forest theme
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleTeacherClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = (sessionData: any) => {
    setShowBookingDialog(false);
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

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

      <div className="pt-24">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h1
              className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl"
              style={{ color: colors.text.primary }}
            >
              Find Your Perfect
              <span className="block text-[#08CB00]">
                Mentor
              </span>
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
                className="w-full p-6 border-0 shadow-lg transition-all duration-200 rounded-3xl"
                style={{
                  backgroundColor: isDarkMode ? colors.background.tertiary : colors.background.primary,
                  border: `1px solid ${isDarkMode ? colors.border.primary : colors.border.secondary}`,
                }}
              >
                <div className="space-y-8">
                  {mentorCategories.map((category, categoryIndex) => (
                    <TeacherCategory
                      key={categoryIndex}
                      category={category}
                      isDarkMode={isDarkMode}
                      onTeacherClick={handleTeacherClick}
                      onBookSession={handleBookSession}
                      showViewAll={true}
                    />
                  ))}
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
          message="Your session has been successfully booked. Check your email for confirmation."
          onClose={() => setShowSuccessNotification(false)}
        />
      )}
    </Layout>
  );
};

export default MentorsPage;
