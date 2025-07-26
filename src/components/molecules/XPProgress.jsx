import React from "react";
import { motion } from "framer-motion";

const XPProgress = ({ xp = 0, level = 1, className = "" }) => {
  const xpForCurrentLevel = (level - 1) * 1000;
  const xpForNextLevel = level * 1000;
  const progressPercentage = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Level {level}</span>
        <span className="text-sm text-gray-500">{xp} XP</span>
      </div>
      
      <div className="relative">
        <div className="w-full h-3 bg-gray-200 rounded-pill overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, progressPercentage))}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full gradient-aqua-yellow rounded-pill relative"
          >
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1 -right-1 w-5 h-5 gradient-pink-purple rounded-full flex items-center justify-center"
        >
          <span className="text-xs">✨</span>
        </motion.div>
      </div>
      
      <p className="text-xs text-gray-400 mt-1">
        {xpForNextLevel - xp} XP to next level
      </p>
    </div>
  );
};

export default XPProgress;