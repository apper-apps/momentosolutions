import React from "react";
import { motion } from "framer-motion";

const Loading = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 gradient-pink-purple rounded-full mb-4 flex items-center justify-center"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-xl">🤗</span>
        </div>
      </motion.div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-center"
      >
        <p className="font-display text-secondary text-lg mb-2">Loading your memories...</p>
        <p className="text-gray-600 text-sm">Momento is preparing something special ✨</p>
      </motion.div>
    </div>
  );
};

export default Loading;