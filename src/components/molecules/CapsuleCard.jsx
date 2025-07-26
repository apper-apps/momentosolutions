import React from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const CapsuleCard = ({ capsule, onClick }) => {
  const isUnlocked = capsule.isUnlocked || new Date() >= new Date(capsule.unlockDate);
  const timeUntilUnlock = formatDistanceToNow(new Date(capsule.unlockDate));
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        hoverable
        onClick={onClick}
        className={`p-6 cursor-pointer relative overflow-hidden ${
          isUnlocked ? "gradient-aqua-yellow text-white" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isUnlocked ? "bg-white/20" : "gradient-pink-purple"
          }`}>
            <ApperIcon 
              name={isUnlocked ? "Gift" : "Lock"} 
              size={20} 
              className={isUnlocked ? "text-white" : "text-white"}
            />
          </div>
          
          {isUnlocked && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              🎁
            </motion.div>
          )}
        </div>
        
        <p className={`text-sm mb-4 line-clamp-2 ${
          isUnlocked ? "text-white/90" : "text-gray-600"
        }`}>
          {capsule.message}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            isUnlocked ? "text-white/80" : "text-gray-400"
          }`}>
            {format(new Date(capsule.unlockDate), "MMM d, yyyy")}
          </span>
          
          {!isUnlocked && (
            <span className="text-xs text-primary font-medium">
              in {timeUntilUnlock}
            </span>
          )}
        </div>
        
        {isUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
          >
            <span className="text-sm">✨</span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default CapsuleCard;