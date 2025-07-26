import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";

const MemoryCard = ({ memory, onClick }) => {
  const moodEmojis = {
    happy: "😊",
    sad: "😢",
    excited: "🎉",
    calm: "😌",
    love: "❤️",
    default: "💭"
  };
  
  const gradientType = memory.mood || "default";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        gradient
        gradientType={gradientType}
        hoverable
        onClick={onClick}
        className="p-6 text-white cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{moodEmojis[memory.mood] || moodEmojis.default}</span>
          <span className="text-white/80 text-sm">
            {format(new Date(memory.timestamp), "MMM d, yyyy")}
          </span>
        </div>
        
        <p className="text-white/90 line-clamp-3 leading-relaxed">
          {memory.content}
        </p>
        
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {memory.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/20 rounded-lg text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default MemoryCard;