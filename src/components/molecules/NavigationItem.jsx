import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, label, emoji, className = "" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? "text-primary" 
            : "text-gray-400 hover:text-primary"
        } ${className}`
      }
    >
      {({ isActive }) => (
        <>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <span className="text-2xl block mb-1">{emoji}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -inset-2 gradient-pink-purple rounded-xl opacity-10"
              />
            )}
          </motion.div>
          <span className="text-xs font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;