import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className = "",
  gradient = false,
  gradientType = "default",
  hoverable = false,
  ...props 
}, ref) => {
  const baseClasses = "rounded-2xl shadow-soft";
  
  const gradients = {
    default: "gradient-pink-purple",
    aqua: "gradient-aqua-yellow",
    happy: "gradient-mood-happy",
    sad: "gradient-mood-sad",
    excited: "gradient-mood-excited",
    calm: "gradient-mood-calm",
    love: "gradient-mood-love",
  };
  
  const cardClasses = cn(
    baseClasses,
    gradient ? gradients[gradientType] : "bg-surface",
    hoverable && "hover:shadow-lg cursor-pointer",
    className
  );
  
  const CardComponent = hoverable ? motion.div : "div";
  
  const motionProps = hoverable ? {
    whileHover: { scale: 1.02, y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      ref={ref}
      className={cardClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;