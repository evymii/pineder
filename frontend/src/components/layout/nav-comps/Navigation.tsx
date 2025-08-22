"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "../../../core/contexts/ThemeContext";
import { useEmailRouting } from "../../../core/hooks/useEmailRouting";
import UserSidebar from "../UserSidebar";
import { Logo } from "./Logo";
import { DesktopNavigation } from "./DesktopNavigation";
import { RightSideControls } from "./RightSideControls";
import { MobileMenu } from "./MobileMenu";

interface NavigationItem {
  id: string;
  name: string;
  href: string;
}

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { colorTheme, toggleTheme, setColorTheme, isDarkMode, colors } =
    useTheme();
  const { userRole } = useEmailRouting();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const getDashboardPath = () => {
    if (userRole === "mentor") return "/user/mentor-dashboard";
    if (userRole === "student") return "/dashboard";
    return "/dashboard";
  };

  const mentorNavigationItems: NavigationItem[] = [
    { id: "dashboard", name: "Dashboard", href: "/user/mentor-dashboard" },
    { id: "group-sessions", name: "Group Sessions", href: "/group-sessions" },
  ];

  const navigationItems: NavigationItem[] = [
    { id: "mentors", name: "Mentors", href: "/mentors" },
    { id: "sessions", name: "Sessions", href: "/sessions" },
    { id: "community", name: "Community", href: "/community/communities" },
    { id: "pricing", name: "Pricing", href: "/#pricing" },
  ];

  const signedInNavigationItems: NavigationItem[] = [
    { id: "mentors", name: "Mentors", href: "/mentors" },
    { id: "sessions", name: "Sessions", href: "/sessions" },
    { id: "dashboard", name: "Dashboard", href: getDashboardPath() },
    { id: "community", name: "Community", href: "/community/communities" },
    { id: "pricing", name: "Pricing", href: "/#pricing" },
  ];

  const currentNavigationItems = isSignedIn
    ? userRole === "mentor"
      ? mentorNavigationItems
      : signedInNavigationItems
    : navigationItems;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: colors.background.primary,
        borderBottom: `1px solid ${colors.border.primary}`,
      }}
    >
      {/* Single Unified Navigation Bar */}
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Side - Logo */}
          <Logo />

          {/* Center - Main Navigation Items (Hidden on mobile) */}
          <div className="hidden md:block">
            <DesktopNavigation
              navigationItems={currentNavigationItems}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Side - Theme Toggle, User Menu, and Mobile Menu Button */}
          <RightSideControls
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            setIsUserSidebarOpen={setIsUserSidebarOpen}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setIsUserSidebarOpen={setIsUserSidebarOpen}
        navigationItems={currentNavigationItems}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
      />

      {/* User Sidebar */}
      {isSignedIn && (
        <UserSidebar
          isOpen={isUserSidebarOpen}
          onClose={() => setIsUserSidebarOpen(false)}
          user={{
            name: user?.fullName || user?.firstName || "User",
            email: user?.emailAddresses[0]?.emailAddress || "",
            role: userRole as "student" | "mentor" | "admin",
            avatar: user?.imageUrl,
            initials:
              user?.firstName?.charAt(0) ||
              user?.emailAddresses[0]?.emailAddress.charAt(0) ||
              "U",
          }}
        />
      )}
    </motion.nav>
  );
}
