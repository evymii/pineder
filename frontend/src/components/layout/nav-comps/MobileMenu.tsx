"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../../../design/system/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../design/system/avatar";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  X,
  Sun,
  Moon,
  Calendar,
  Users,
  BookOpen,
  Gift,
  IceCream,
  Coffee,
} from "lucide-react";
import { useTheme } from "../../../core/contexts/ThemeContext";
import type { ColorTheme } from "../../../core/contexts/ThemeContext";

interface NavigationItem {
  id: string;
  name: string;
  href: string;
}

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setIsUserSidebarOpen: (open: boolean) => void;
  navigationItems: NavigationItem[];
  isDarkMode: boolean;
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

export function MobileMenu({
  menuOpen,
  setMenuOpen,
  setIsUserSidebarOpen,
  navigationItems,
  isDarkMode,
  toggleTheme,
  colorTheme,
  setColorTheme,
}: MobileMenuProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const { colors } = useTheme();

  const renderMobileNavigationItem = (item: NavigationItem) => {
    if (item.id === "community") {
      return (
        <div key={item.id} className="space-y-2">
          <div
            className="text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </div>
          <div className="ml-4 space-y-2">
            <Link
              href="/community/events"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </Link>

            <Link
              href="/community/communities"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Users className="w-5 h-5" />
              <span>Communities</span>
            </Link>
          </div>
        </div>
      );
    }

    if (item.id === "sessions") {
      return (
        <div key={item.id} className="space-y-2">
          <div
            className="text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </div>
          <div className="ml-4 space-y-2">
            <Link
              href="/sessions"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <BookOpen className="w-5 h-5" />
              <span>My Sessions</span>
            </Link>
            <Link
              href="/group-sessions"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Users className="w-5 h-5" />
              <span>Group Sessions</span>
            </Link>
          </div>
        </div>
      );
    }

    if (item.id === "pricing") {
      return (
        <div key={item.id} className="space-y-2">
          <div
            className="text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            {item.name}
          </div>
          <div className="ml-4 space-y-2">
            <Link
              href="/#pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Gift className="w-5 h-5" />
              <span>Free - No cost, pure learning</span>
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <IceCream className="w-5 h-5" />
              <span>Ice Cream - Sweet learning experience</span>
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-base transition-all duration-300 transform cursor-pointer font-inter hover:scale-105 focus:outline-none"
              style={{ color: colors.text.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.primary;
              }}
            >
              <Coffee className="w-5 h-5" />
              <span>Coffee - Energizing learning boost</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href}
        onClick={() => setMenuOpen(false)}
        className="block text-lg font-medium transition-all duration-300 transform font-outfit hover:text-accent-foreground hover:scale-105 focus:outline-none"
        style={{ color: colors.text.primary }}
      >
        {item.name}
      </Link>
    );
  };

  if (!menuOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] md:hidden"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="h-full px-4 py-6 space-y-4 overflow-y-auto">
        {/* Mobile Menu Header with Close Button */}
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: colors.border.primary }}
        >
          <h3
            className="text-lg font-semibold font-outfit"
            style={{ color: colors.text.primary }}
          >
            Menu
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 p-0 transition-all duration-300 ease-in-out border rounded-lg"
            style={{
              color: colors.text.primary,
              borderColor: colors.border.primary,
              backgroundColor: "transparent",
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation Items */}
        {navigationItems.map(renderMobileNavigationItem)}

        {/* Mobile Theme Options */}
        <div
          className="pt-4 border-t"
          style={{ borderColor: colors.border.primary }}
        >
          <h4
            className="mb-3 text-lg font-medium font-outfit"
            style={{ color: colors.text.primary }}
          >
            Theme Options
          </h4>
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="justify-start w-full text-lg"
              style={{ color: colors.text.primary }}
            >
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span>Switch to {isDarkMode ? "Light" : "Dark"} Mode</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                setColorTheme(colorTheme === "default" ? "original" : "default")
              }
              className="justify-start w-full text-lg"
              style={{ color: colors.text.primary }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: colors.accent.primary }}
                ></div>
                <span>
                  Color Theme:{" "}
                  {colorTheme === "default" ? "Default" : "Original"}
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile User Actions */}
        {isLoaded && (
          <div
            className="pt-4 border-t"
            style={{ borderColor: colors.border.primary }}
          >
            <h4
              className="mb-3 text-lg font-medium font-outfit"
              style={{ color: colors.text.primary }}
            >
              User Account
            </h4>
            {isSignedIn ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
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
                  <div>
                    <div
                      className="font-medium text-lg"
                      style={{ color: colors.text.primary }}
                    >
                      {user?.fullName || user?.firstName || "User"}
                    </div>
                    <div
                      className="text-base"
                      style={{ color: colors.text.primary }}
                    >
                      {user?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsUserSidebarOpen(true);
                    setMenuOpen(false);
                  }}
                  className="justify-start w-full text-lg"
                  style={{ color: colors.text.primary }}
                >
                  Profile Settings
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <SignInButton mode="modal">
                  <Button
                    className="w-full font-medium text-lg transition-all duration-200 transform shadow-lg cursor-pointer hover:shadow-xl hover:scale-105"
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
          </div>
        )}
      </div>
    </motion.div>
  );
}
