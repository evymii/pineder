import { motion } from "framer-motion";
import { useTheme } from "../../core/contexts/ThemeContext";

interface SpotlightHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  quote?: string;
  author?: string;
}

export const SpotlightHero = ({
  title,
  subtitle,
  description,
  quote,
  author,
}: SpotlightHeroProps) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 50%, ${colors.background.tertiary} 100%)`,
        }}
      />

      {/* Main Content Panel */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="relative">
          {/* Top Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: -30 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-0 left-0 text-left"
          >
            <div className="space-y-2">
              <div
                className="text-lg font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                ILLUMINATE
              </div>
              <div
                className="text-lg font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                YOUR PATH
              </div>
              <div
                className="text-lg font-light tracking-widest"
                style={{ color: colors.text.primary }}
              >
                TO SUCCESS
              </div>
            </div>
          </motion.div>

          {/* Central Main Title */}
          <div className="text-center relative">
            {/* Subtitle */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-8"
              >
                <span
                  className="text-4xl md:text-6xl font-light tracking-widest"
                  style={{
                    color: colors.text.primary,
                    textShadow: `0 0 20px ${colors.accent.primary}40`,
                  }}
                >
                  {subtitle}
                </span>
              </motion.div>
            )}

            {/* Main Title with Spotlight Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative"
            >
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight"
                style={{ color: colors.text.primary }}
              >
                {title}
              </h1>

              {/* Spotlight Circle Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${colors.background.card} 0%, transparent 70%)`,
                }}
              >
                <div
                  className="w-32 h-32 md:w-48 md:h-48 rounded-full opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${colors.accent.primary} 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 max-w-4xl mx-auto text-xl md:text-2xl leading-relaxed"
              style={{ color: colors.text.secondary }}
            >
              {description}
            </motion.p>
          </div>

          {/* Bottom Left Quote */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, x: -50, y: 30 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="absolute bottom-0 left-0 flex items-start space-x-4"
            >
              {/* Large Quotation Mark */}
              <div
                className="text-8xl md:text-9xl font-light opacity-20"
                style={{
                  color: colors.text.primary,
                  textShadow: `0 0 30px ${colors.accent.primary}40`,
                }}
              >
                &quot;
              </div>

              {/* Quote Text */}
              <div className="max-w-md space-y-2">
                <p
                  className="text-sm md:text-base leading-relaxed font-light"
                  style={{ color: colors.text.secondary }}
                >
                  {quote}
                </p>
                {author && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.accent.primary }}
                  >
                    — {author}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Bottom Right Corner Detail */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-0 right-0"
          >
            <div
              className="w-8 h-8 border-2 rounded-sm"
              style={{
                borderColor: colors.text.primary,
                opacity: 0.3,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              background: colors.accent.primary,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};
