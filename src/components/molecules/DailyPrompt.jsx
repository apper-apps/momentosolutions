import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const DailyPrompt = ({ prompt, onStartWriting, className = "" }) => {
  const prompts = [
    "What made you smile today? 😊",
    "Describe a moment that felt like magic ✨",
    "What are you grateful for right now? 🙏",
    "Share something that inspired you today 🌟",
    "What's a small victory you had today? 🎉",
    "Describe a person who brightened your day 💝",
    "What's something beautiful you noticed? 🌸",
    "Share a moment of peace you found today 🕊️"
  ];
  
  const currentPrompt = prompt || prompts[Math.floor(Math.random() * prompts.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card gradient gradientType="happy" className="p-6 text-white">
        <div className="flex items-start gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotateZ: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-3xl"
          >
            💭
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-display text-lg mb-3">Daily Reflection</h3>
            <p className="text-white/90 mb-4 leading-relaxed">
              {currentPrompt}
            </p>
            
            <Button
              variant="outline"
              onClick={onStartWriting}
              className="border-white/30 text-white hover:bg-white hover:text-secondary"
              icon="PenTool"
            >
              Start Writing
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DailyPrompt;