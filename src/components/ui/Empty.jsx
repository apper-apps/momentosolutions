import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No memories yet", 
  description = "Start creating beautiful memories today!", 
  actionText = "Create Memory",
  onAction,
  icon = "Heart",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className="w-24 h-24 gradient-aqua-yellow rounded-3xl mb-4 flex items-center justify-center shadow-soft">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
        <span className="text-6xl block mb-4">🌟</span>
      </motion.div>
      
      <h3 className="font-display text-2xl text-secondary mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">{description}</p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="gradient-pink-purple text-white px-8 py-4 rounded-pill font-medium shadow-soft hover:shadow-glow transition-all duration-200 flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          {actionText}
        </motion.button>
      )}
    </div>
  );
};

export default Empty;