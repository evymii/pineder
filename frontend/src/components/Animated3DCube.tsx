import { motion } from "framer-motion";
import { useTheme } from "../core/contexts/ThemeContext";

// 3D Animated Cube Component
export const Animated3DCube = () => {
  const { colors } = useTheme();

  console.log("3D Cube rendering with colors:", colors);

  return (
    <div className="fixed z-20 w-40 h-40 pointer-events-none top-20 right-10 hidden lg:block">
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
          rotateZ: [0, 180],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{
          scale: 1.3,
          rotateX: [0, 720],
          rotateY: [0, 720],
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {/* Front face */}
        <div
          className="absolute w-full h-full border-2"
          style={{
            transform: "translateZ(20px)",
            background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            borderColor: colors.accent.success,
          }}
        />

        {/* Back face */}
        <div
          className="absolute w-full h-full border-2"
          style={{
            transform: "translateZ(-20px) rotateY(180deg)",
            background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
            borderColor: colors.accent.primary,
          }}
        />

        {/* Right face */}
        <div
          className="absolute w-full h-full border-2"
          style={{
            transform: "translateX(20px) rotateY(90deg)",
            background: `linear-gradient(135deg, ${colors.accent.success} 0%, ${colors.accent.primary} 100%)`,
            borderColor: colors.accent.secondary,
          }}
        />

        {/* Left face */}
        <div
          className="absolute w-full h-full border-2"
          style={{
            transform: "translateX(-20px) rotateY(-90deg)",
            background: `linear-gradient(135deg, ${colors.accent.primary} 0%, ${colors.accent.secondary} 100%)`,
            borderColor: colors.accent.success,
          }}
        />

        {/* Top face */}
        <div
          className="absolute w-full h-full border-2"
          style={{
            transform: "translateY(-20px) rotateX(90deg)",
            background: `linear-gradient(135deg, ${colors.accent.secondary} 0%, ${colors.accent.success} 100%)`,
            borderColor: colors.accent.primary,
          }}
        />

        {/* Bottom face */}
        <div
          className="absolute w-full h-full border-2"
          style={{
            transform: "translateY(20px) rotateX(-90deg)",
            background: `linear-gradient(135deg, ${colors.accent.success} 0%, ${colors.accent.primary} 100%)`,
            borderColor: colors.accent.secondary,
          }}
        />
      </motion.div>

      {/* Small particles around the cube */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`cube-particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${50 + Math.cos(i * 0.785) * 30}%`,
            top: `${50 + Math.sin(i * 0.785) * 30}%`,
            background: colors.accent.primary,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
