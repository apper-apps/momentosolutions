import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const ChatBubble = ({ message, isUser = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 mb-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-10 h-10 gradient-pink-purple rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🤗</span>
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-4 rounded-2xl shadow-soft ${
            isUser 
              ? "gradient-aqua-yellow text-white" 
              : "bg-white border border-gray-100"
          }`}
        >
          <p className={`text-sm leading-relaxed ${isUser ? "text-white" : "text-gray-800"}`}>
            {message.content}
          </p>
        </motion.div>
        
        <span className="text-xs text-gray-400 mt-1 px-2">
          {format(new Date(message.timestamp), "HH:mm")}
        </span>
      </div>
      
      {isUser && (
        <div className="w-10 h-10 gradient-aqua-yellow rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg">😊</span>
        </div>
      )}
    </motion.div>
  );
};

export default ChatBubble;