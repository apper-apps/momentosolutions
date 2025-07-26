import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-gradient-to-br from-error to-primary rounded-full mb-6 flex items-center justify-center shadow-soft"
      >
        <span className="text-3xl">😔</span>
      </motion.div>
      
      <h3 className="font-display text-xl text-secondary mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{message}</p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="gradient-pink-purple text-white px-6 py-3 rounded-pill font-medium shadow-soft hover:shadow-glow transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </motion.button>
      )}
    </div>
  );
};

export default Error;