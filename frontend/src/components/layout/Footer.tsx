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

  const footerLinks = {
    product: [
      { name: "Features", href: "/#features" },
      { name: "Mentors", href: "/mentors" },
      { name: "Sessions", href: "/sessions" },
      { name: "Group Sessions", href: "/group-sessions" },
      { name: "Community", href: "/community/communities" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Status", href: "/status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

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
      className="transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Top Section - Links and Logo */}
      <div
        className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8"
        style={{ color: colors.text.primary }}
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Logo and Slogan - Left Side */}
          <div className="md:col-span-2">
            <div className="flex flex-col space-y-2">
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
              <p
                className={`text-lg transition-colors duration-300 ${colors.text.muted}`}
              >
                EDUCATION PLATFORM
              </p>
            </div>
          </div>

          {/* Navigation Links - Right Side */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {/* Product Links */}
              <div className="space-y-3">
                <h3
                  className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 font-space-grotesk ${colors.text.primary}`}
                >
                  Product
                </h3>
                <ul className="space-y-2">
                  {footerLinks.product.map((link) => (
                    <motion.li
                      key={link.name}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`text-base transition-all duration-300 font-inter ${colors.text.muted} hover:text-gray-900 inline-block transform hover:scale-105`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.accent.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.muted;
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div className="space-y-3">
                <h3
                  className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 font-space-grotesk ${colors.text.primary}`}
                >
                  Company
                </h3>
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <motion.li
                      key={link.name}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`text-base transition-all duration-300 font-inter ${colors.text.muted} hover:text-gray-900 inline-block transform hover:scale-105`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.accent.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.muted;
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div className="space-y-3">
                <h3
                  className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 font-space-grotesk ${colors.text.primary}`}
                >
                  Support
                </h3>
                <ul className="space-y-2">
                  {footerLinks.support.map((link) => (
                    <motion.li
                      key={link.name}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`text-base transition-all duration-300 font-inter ${colors.text.muted} hover:text-gray-900 inline-block transform hover:scale-105`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.accent.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.muted;
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-3">
                <h3
                  className={`text-sm font-bold tracking-wider uppercase transition-colors duration-300 font-space-grotesk ${colors.text.primary}`}
                >
                  Legal
                </h3>
                <ul className="space-y-2">
                  {footerLinks.legal.map((link) => (
                    <motion.li
                      key={link.name}
                      whileHover={{ x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`text-base transition-all duration-300 font-inter ${colors.text.muted} hover:text-gray-900 inline-block transform hover:scale-105`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.accent.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.text.muted;
                        }}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div
        className="transition-colors duration-200 border-t"
        style={{ borderColor: colors.border.primary }}
      />

      {/* Bottom Section - Social Media and Copyright */}
      <div
        className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8"
        style={{ color: colors.text.primary }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 transition-all duration-300 rounded-full"
                style={{
                  backgroundColor: isDarkMode
                    ? colors.text.inverse
                    : colors.text.primary,
                  borderColor: isDarkMode
                    ? colors.border.secondary
                    : colors.border.primary,
                }}
                whileHover={{
                  scale: 1.15,
                  y: -3,
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

          {/* Copyright Notice */}
          <div className="text-center">
            <p
              className={`text-sm ${colors.text.muted} transition-colors duration-200`}
            >
              © 2025 Pineder. All rights reserved.
            </p>
          </div>

          {/* Made with Heart */}
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
