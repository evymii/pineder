"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../../design/system/button";
import { Badge } from "../../design/system/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../design/system/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../design/system/dropdown-menu";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useTheme } from "../../core/contexts/ThemeContext";
import { useEmailRouting } from "../../core/hooks/useEmailRouting";
import UserSidebar from "./UserSidebar";
import {
  X,
  ChevronDown,
  Sprout,
  Calendar,
  Lightbulb,
  Users,
  Moon,
  Sun,
  BookOpen,
  Gift,
  IceCream,
  Coffee,
} from "lucide-react";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bottomNavVisible, setBottomNavVisible] = useState(true);
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { colorTheme, toggleTheme, setColorTheme, isDarkMode, colors } =
    useTheme();

  const { userRole } = useEmailRouting();

  const getDashboardPath = () => {
    if (userRole === "mentor") return "/mentor-dashboard";
    if (userRole === "student") return "/dashboard";
    return "/dashboard"; // Default for others
  };

  const mentorNavigationItems = [
    { id: "dashboard", name: "Dashboard", href: "/mentor-dashboard" },
  ];

  const navigationItems = [
    { id: "mentors", name: "Mentors", href: "/mentors" },
    { id: "sessions", name: "Sessions", href: "/sessions" },
    { id: "community", name: "Community", href: "/community/communities" },
    { id: "pricing", name: "Pricing", href: "/#pricing" },
  ];

  const signedInNavigationItems = [
    { id: "mentors", name: "Mentors", href: "/mentors" },
    { id: "sessions", name: "Sessions", href: "/sessions" },
    { id: "dashboard", name: "Dashboard", href: getDashboardPath() },
    {
      id: "community",
      name: "Community",
      href: "/community/communities",
    },
    { id: "pricing", name: "Pricing", href: "/#pricing" },
  ];

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
      {/* Top Section - Logo, Theme Toggle, User Menu */}
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Link
              href="/"
              className="flex items-center space-x-2 transition-all duration-300"
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent.primary}, ${colors.accent.secondary})`,
                }}
              >
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-bold font-outfit"
                style={{ color: colors.text.primary }}
              >
                Pineder
              </span>
            </Link>
          </motion.div>

          {/* Right Side - Theme Toggle, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 p-0 transition-all duration-500 ease-in-out border rounded-full hover:scale-110"
                style={{
                  borderColor: colors.border.primary,
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border.primary;
                }}
              >
                <div className="relative flex items-center justify-center w-5 h-5">
                  <Sun
                    className={`w-5 h-5 absolute inset-0 m-auto transition-all duration-500 ${
                      isDarkMode
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-90"
                    }`}
                    style={{ color: colors.text.primary }}
                  />
                  <Moon
                    className={`w-5 h-5 absolute inset-0 m-auto transition-all duration-500 ${
                      isDarkMode
                        ? "opacity-0 rotate-90"
                        : "opacity-100 rotate-0"
                    }`}
                    style={{ color: colors.text.primary }}
                  />
                </div>
              </Button>

              {/* Show Bottom Navigation Button (when hidden) */}
              {!bottomNavVisible && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBottomNavVisible(true)}
                  className="w-8 h-8 p-0 border rounded-lg transition-all duration-300 ease-in-out"
                  style={{
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.accent.primary;
                    e.currentTarget.style.color = colors.accent.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border.primary;
                    e.currentTarget.style.color = colors.text.primary;
                  }}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              )}

              {/* Color Theme Switcher */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setColorTheme(
                          colorTheme === "default" ? "original" : "default"
                        )
                      }
                      className={`${colors.text.primary} hover:text-[var(--pico-secondary)] hover:bg-foreground/5 transition-colors duration-200 font-medium cursor-pointer`}
                    >
                      {colorTheme === "default" ? "Default" : "Original"}
                    </Button>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              </div>

              {/* User Menu */}
              {isLoaded && (
                <>
                  {isSignedIn ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 p-0 transition-all duration-300 ease-in-out border rounded-lg hover:bg-gray-100"
                      style={{
                        borderColor: colors.border.primary,
                        color: colors.text.primary,
                      }}
                      onClick={() => setIsUserSidebarOpen(true)}
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={user?.imageUrl}
                          alt={user?.fullName || "User"}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) ||
                            user?.emailAddresses[0]?.emailAddress.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <SignInButton mode="modal">
                        <Button
                          className="font-medium transition-all duration-200 transform shadow-lg cursor-pointer hover:shadow-xl hover:scale-105"
                          style={{
                            background: `linear-gradient(to right, ${colors.accent.secondary}, ${colors.accent.success})`,
                            color: colors.text.inverse,
                          }}
                        >
                          Get Started
                        </Button>
                      </SignInButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Main Navigation */}
      {bottomNavVisible && (
        <div className="hidden px-4 mx-auto md:block max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 mx-auto transition-all duration-300 max-w-7xl sm:px-6 lg:px-8"
          >
            <div className="relative flex items-center justify-center py-4">
              {/* Centered Navigation Items */}
              <nav className="flex items-center justify-center mx-auto space-x-8">
                {(isSignedIn
                  ? userRole === "mentor"
                    ? mentorNavigationItems
                    : signedInNavigationItems
                  : navigationItems
                ).map((item) => {
                  if (item.id === "community") {
                    return (
                      <DropdownMenu key={item.id}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`text-md transition-all duration-300 font-outfit font-medium cursor-pointer flex items-center space-x-1 focus:outline-none focus:ring-0`}
                            style={{ color: colors.text.primary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#6B7280"; // gray-600
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.color = "#059669"; // green-600
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                              style={{ color: colors.text.primary }}
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="w-48 shadow-lg bg-background/95 backdrop-blur-md"
                        >
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/community/events"
                                className="flex items-center inline-block space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#6B7280"; // gray-600
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color = "#059669"; // green-600
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <Calendar className="w-4 h-4" />
                                <span>Events</span>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/community/suggestions"
                                className="flex items-center inline-block space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#6B7280"; // gray-600
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color = "#059669"; // green-600
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <Lightbulb className="w-4 h-4" />
                                <span>Suggestions</span>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/community/communities"
                                className="flex items-center inline-block space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#6B7280"; // gray-600
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color = "#059669"; // green-600
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <Users className="w-4 h-4" />
                                <span>Communities</span>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }

                  if (item.id === "sessions") {
                    return (
                      <DropdownMenu key={item.id}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`text-md transition-all duration-300 font-outfit font-medium cursor-pointer flex items-center space-x-1 focus:outline-none focus:ring-0`}
                            style={{ color: colors.text.primary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#6B7280"; // gray-600
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.color = "#059669"; // green-600
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                          >
                            <span className="flex items-center space-x-1">
                              <span>{item.name}</span>
                              <ChevronDown
                                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                                style={{ color: colors.text.primary }}
                              />
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="w-48 shadow-lg bg-background/95 backdrop-blur-md"
                        >
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/sessions"
                                className="flex items-center inline-block space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#6B7280"; // gray-600
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color = "#059669"; // green-600
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <BookOpen className="w-4 h-4" />
                                <span>My Sessions</span>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/group-sessions"
                                className="flex items-center inline-block space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#6B7280"; // gray-600
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color = "#059669"; // green-600
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <Users className="w-4 h-4" />
                                <span>Group Sessions</span>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }

                  if (item.id === "pricing") {
                    return (
                      <DropdownMenu key={item.id}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`text-md transition-all duration-300 font-outfit font-medium cursor-pointer flex items-center space-x-1 focus:outline-none focus:ring-0`}
                            style={{ color: colors.text.primary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = "#6B7280"; // gray-600
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.color = "#059669"; // green-600
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.color = colors.text.primary;
                            }}
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                              style={{ color: colors.text.primary }}
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="center"
                          className="shadow-lg w-72 bg-background/95 backdrop-blur-md"
                        >
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/#pricing"
                                className="flex items-center inline-block space-x-3 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color =
                                    colors.accent.primary;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color =
                                    colors.accent.primary;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <div className="relative">
                                  <div
                                    className="flex items-center justify-center w-8 h-8 border rounded-full"
                                    style={{
                                      backgroundColor:
                                        colors.background.primary,
                                      borderColor: colors.border.primary,
                                    }}
                                  >
                                    <Gift
                                      className="w-4 h-4"
                                      style={{ color: colors.accent.primary }}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className="font-bold font-space-grotesk"
                                    style={{ color: colors.accent.primary }}
                                  >
                                    Free
                                  </span>
                                  <span
                                    className="text-base font-inter"
                                    style={{ color: colors.text.muted }}
                                  >
                                    No cost, pure learning
                                  </span>
                                </div>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/#pricing"
                                className="flex items-center inline-block space-x-3 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#6B7280"; // gray-600
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color = "#059669"; // green-600
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <div className="relative">
                                  <div
                                    className="flex items-center justify-center w-8 h-8 border rounded-full"
                                    style={{
                                      backgroundColor:
                                        colors.background.primary,
                                      borderColor: colors.border.primary,
                                    }}
                                  >
                                    <IceCream
                                      className={`w-5 h-5 ${
                                        isDarkMode
                                          ? "text-orange-400"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className={`font-bold font-space-grotesk ${
                                      isDarkMode
                                        ? "text-orange-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    Ice Cream
                                  </span>
                                  <span
                                    className={`text-base font-inter ${
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    Sweet learning experience
                                  </span>
                                </div>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <motion.div
                              whileHover={{ x: 4 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Link
                                href="/#pricing"
                                className="flex items-center inline-block space-x-3 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
                                style={{ color: colors.text.muted }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color =
                                    colors.accent.primary;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.color =
                                    colors.accent.primary;
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.color =
                                    colors.text.muted;
                                }}
                              >
                                <div className="relative">
                                  <div
                                    className="flex items-center justify-center w-8 h-8 border rounded-full"
                                    style={{
                                      backgroundColor:
                                        colors.background.primary,
                                      borderColor: colors.border.primary,
                                    }}
                                  >
                                    <Coffee
                                      className={`w-5 h-5 ${
                                        isDarkMode
                                          ? "text-orange-400"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span
                                    className={`font-bold font-space-grotesk ${
                                      isDarkMode
                                        ? "text-orange-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    Coffee
                                  </span>
                                  <span
                                    className={`text-base font-inter ${
                                      isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    Energizing learning boost
                                  </span>
                                </div>
                              </Link>
                            </motion.div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -2 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`text-md transition-all duration-300 font-outfit font-medium cursor-pointer inline-block transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-0`}
                        style={{
                          color: colors.text.primary,
                          textShadow: "0 0 0 transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#6B7280"; // gray-600
                          e.currentTarget.style.textShadow = `0 2px 8px ${colors.accent.primary}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.primary;
                          e.currentTarget.style.textShadow =
                            "0 0 0 transparent";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.color = "#059669"; // green-600
                          e.currentTarget.style.textShadow = `0 2px 8px ${colors.accent.primary}40`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.color = colors.text.primary;
                          e.currentTarget.style.textShadow =
                            "0 0 0 transparent";
                        }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Close Button - Positioned absolutely on the right */}
              <div className="absolute right-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setBottomNavVisible(false)}
                  className="w-8 h-8 p-0 transition-all duration-300 ease-in-out border rounded-lg"
                  style={{
                    color: colors.text.primary,
                    borderColor: colors.border.primary,
                    backgroundColor: colors.button.secondary,
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: menuOpen ? 1 : 0,
          height: menuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden transition-all duration-300 md:hidden"
        style={{
          backgroundColor: colors.background.secondary,
        }}
      >
        <div className="px-4 py-6 space-y-4">
          {(isSignedIn
            ? userRole === "mentor"
              ? mentorNavigationItems
              : signedInNavigationItems
            : navigationItems
          ).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-base font-medium transition-all duration-300 transform font-outfit hover:text-accent-foreground hover:scale-105"
                style={{
                  color: colors.text.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.text.primary;
                }}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
