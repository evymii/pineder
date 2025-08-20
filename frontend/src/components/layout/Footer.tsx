import { motion } from "framer-motion";
import { Button } from "../../design/system/button";
import { Separator } from "../../design/system/separator";
import { Badge } from "../../design/system/badge";
import { Input } from "../../design/system/input";
import { Card, CardContent } from "../../design/system/card";
import {
  Sprout,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Facebook,
  Rss,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "../../core/contexts/ThemeContext";
import { cn } from "../../design/system/utils";

export function Footer() {
  const { isDarkMode, colors } = useTheme();

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com",
    },
    {
      name: "RSS",
      icon: Rss,
      href: "/rss",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com",
    },
    {
      name: "Mail",
      icon: Mail,
      href: "mailto:contact@pineder.com",
    },
  ];

  return (
    <footer
      className="transition-colors duration-200 border-t"
      style={{
        backgroundColor: colors.background.primary,
        borderTopColor: colors.border.primary,
      }}
    >
      {/* Top Row - Logo and Social Icons in one line */}
      <div
        className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8"
        style={{ color: colors.text.primary }}
      >
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              className="flex items-center justify-center w-10 h-10 transition-colors duration-300 rounded-lg"
              style={{
                backgroundColor: isDarkMode
                  ? colors.text.inverse
                  : colors.text.primary,
              }}
            >
              <Sprout
                className={`w-6 h-6 transition-colors duration-300 ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              />
            </div>
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${colors.text.primary}`}
            >
              PINEDER
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 transition-all duration-300 rounded-full"
                style={{
                  backgroundColor: isDarkMode
                    ? colors.text.inverse
                    : colors.text.primary,
                  borderColor: isDarkMode
                    ? colors.border.secondary
                    : colors.border.primary,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  backgroundColor: colors.accent.primary,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <social.icon
                  className="w-5 h-5 transition-all duration-300"
                  style={{
                    color: isDarkMode
                      ? colors.text.primary
                      : colors.text.inverse,
                  }}
                />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Compact Text Only */}
      <div
        className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
        style={{ color: colors.text.primary }}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center">
            <p
              className={`text-sm ${colors.text.muted} transition-colors duration-200`}
            >
              © 2025 Pineder. All rights reserved.
            </p>
          </div>
          <div className="text-center">
            <p
              className={`text-sm ${colors.text.muted} transition-colors duration-200`}
            >
              Made with <Heart className="inline w-4 h-4 mx-1 text-red-500" />{" "}
              by Pineder Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
