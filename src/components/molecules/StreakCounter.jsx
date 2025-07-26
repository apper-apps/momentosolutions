import React from "react";
import { motion } from "framer-motion";

const StreakCounter = ({ streakCount = 0, className = "" }) => {
  const flameIntensity = Math.min(streakCount, 10);
  
  const flameVariants = {
    low: { scale: 1, rotate: 0 },
    medium: { scale: 1.1, rotate: [-2, 2, -1] },
    high: { scale: 1.2, rotate: [-3, 3, -2, 2] }
  };
  
  const getFlameVariant = () => {
    if (streakCount < 3) return "low";
    if (streakCount < 7) return "medium";
    return "high";
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={flameVariants[getFlameVariant()]}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="relative"
      >
        <span className="text-2xl filter drop-shadow-lg">🔥</span>
        {streakCount >= 7 && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur-sm opacity-30"
          />
        )}
      </motion.div>
      
      <div>
        <motion.span 
          key={streakCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-2xl font-display text-secondary"
        >
          {streakCount}
        </motion.span>
        <p className="text-xs text-gray-500 -mt-1">day streak</p>
      </div>
    </div>
  );
};

export default StreakCounter;