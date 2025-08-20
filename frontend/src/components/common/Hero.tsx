import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Zap, Rocket } from "lucide-react";
import { useTheme } from "../../core/contexts/ThemeContext";

import { LogoLoader } from "../shared/LogoLoader";

export const Hero = () => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);

  const codeSnippets = [
    "const future = await code();",
    "function learn() { return 'success'; }",
    "if (dedication) { achieve(); }",
    "while (learning) { grow(); }",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen transition-colors duration-300"
        style={{
          background: `linear-gradient(to bottom right, ${colors.background.primary}, ${colors.background.secondary}, ${colors.background.tertiary})`,
        }}
      >
        <LogoLoader
          message="Initializing your learning journey... 🚀"
          size="lg"
        />
      </div>
    );
  }

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Theme-aware background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: colors.background.primary,
        }}
      />

      <div className="relative z-10 max-w-6xl px-4 mx-auto text-center">
        {/* Main heading with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.h1
            className="mb-6 text-5xl font-bold md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span style={{ color: colors.text.primary }}>Code Your</span>
            <span
              className="block text-transparent bg-gradient-to-r bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary}, ${colors.accent.success})`,
              }}
            >
              Future
            </span>
          </motion.h1>
        </motion.div>

        {/* Animated code snippet */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div
            className="max-w-2xl p-6 mx-auto border rounded-lg backdrop-blur-sm transition-colors duration-300"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: `${colors.background.card}80`,
            }}
          >
            <motion.div
              key={currentCodeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <div className="flex items-center mb-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span className="ml-3 text-sm text-gray-400">code.js</span>
              </div>
              <pre className="font-mono text-lg text-green-400">
                <code>{codeSnippets[currentCodeIndex]}</code>
              </pre>
            </motion.div>
          </div>
        </motion.div>

        {/* Description */}
        <div
          className="max-w-3xl mx-auto mb-12 text-xl transition-colors duration-300"
          style={{ color: colors.text.secondary }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Master coding skills through personalized mentorship, collaborative
            learning, and hands-on projects. Join a community of developers
            building the future.
          </motion.p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col justify-center gap-4 mb-16 sm:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              className="px-8 py-4 text-lg font-semibold transition-all duration-300 border-2 rounded-lg hover:scale-105"
              style={{
                color: colors.accent.primary,
                borderColor: colors.accent.primary,
                backgroundColor: `${colors.accent.primary}10`,
              }}
            >
              View Projects
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              className="px-8 py-4 text-lg font-semibold transition-all duration-300 rounded-lg hover:scale-105"
              style={{
                backgroundColor: colors.accent.secondary,
                color: "white",
              }}
            >
              Join Sessions
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating tech icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { icon: Zap, x: "10%", y: "20%" },
          { icon: Rocket, x: "85%", y: "30%" },
        ].map((item, index) => (
          <div
            key={index}
            className="absolute"
            style={{ left: item.x, top: item.y }}
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              <item.icon
                className="w-8 h-8 opacity-20"
                style={{ color: colors.accent.primary }}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};
