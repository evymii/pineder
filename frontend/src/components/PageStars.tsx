import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";

// Page-wide Star Elements Component
export const PageStars = () => {
  const { colors } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
      {/* Aesthetic scattered stars */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`aesthetic-star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            scale: [0.8, 1.3, 0.8],
            opacity: [0.3, 0.9, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 5 + 4,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-2 h-2"
            style={{
              background: `radial-gradient(circle, ${colors.accent.primary} 0%, ${colors.accent.secondary} 30%, transparent 80%)`,
              filter: `drop-shadow(0 0 6px ${colors.accent.primary}) drop-shadow(0 0 12px ${colors.accent.secondary})`,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        </motion.div>
      ))}

      {/* Twinkling aesthetic stars */}
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={`twinkle-aesthetic-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-1.5 h-1.5"
            style={{
              background: `radial-gradient(circle, ${colors.accent.secondary} 0%, ${colors.accent.success} 50%, transparent 100%)`,
              filter: `drop-shadow(0 0 8px ${colors.accent.secondary}) drop-shadow(0 0 16px ${colors.accent.success})`,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        </motion.div>
      ))}

      {/* Floating sparkles with trails */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`sparkle-trail-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 15 - 7.5, 0],
            rotate: [0, 360],
            scale: [0.7, 1.4, 0.7],
          }}
          transition={{
            duration: Math.random() * 6 + 5,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-1.5 h-1.5"
            style={{
              background: `radial-gradient(circle, ${colors.accent.success} 0%, ${colors.accent.primary} 40%, transparent 90%)`,
              filter: `drop-shadow(0 0 5px ${colors.accent.success}) drop-shadow(0 0 10px ${colors.accent.primary})`,
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
          />
        </motion.div>
      ))}

      {/* Diamond-shaped stars */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`diamond-star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, Math.random() * 12 - 6, 0],
            scale: [0.9, 1.1, 0.9],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="w-2.5 h-2.5"
            style={{
              background: `linear-gradient(45deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 25%, ${colors.accent.success} 50%, ${colors.accent.secondary} 75%, ${colors.accent.primary} 100%)`,
              filter: `drop-shadow(0 0 8px ${colors.accent.primary}) drop-shadow(0 0 16px ${colors.accent.secondary})`,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        </motion.div>
      ))}

      {/* Pulsing circular stars */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`pulse-star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0.6, 1.5, 0.6],
            opacity: [0.2, 0.7, 0.2],
            y: [0, -18, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.accent.secondary} 0%, ${colors.accent.primary} 60%, transparent 100%)`,
              filter: `drop-shadow(0 0 10px ${colors.accent.secondary}) drop-shadow(0 0 20px ${colors.accent.primary})`,
            }}
          />
        </motion.div>
      ))}

      {/* Shooting star effects */}
      {Array.from({ length: 2 }, (_, i) => (
        <motion.div
          key={`shooting-star-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, -100],
            y: [0, -100],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          <div
            className="w-1 h-1"
            style={{
              background: `linear-gradient(90deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 50%, ${colors.accent.success} 100%)`,
              filter: `drop-shadow(0 0 15px ${colors.accent.primary}) drop-shadow(0 0 30px ${colors.accent.secondary})`,
              borderRadius: "50%",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
