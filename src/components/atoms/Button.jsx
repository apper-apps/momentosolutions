import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "gradient-pink-purple text-white shadow-soft hover:shadow-glow",
    secondary: "gradient-aqua-yellow text-white shadow-soft hover:shadow-accent-glow",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-secondary hover:bg-gray-100",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl gap-1",
    md: "px-6 py-3 text-base rounded-pill gap-2",
    lg: "px-8 py-4 text-lg rounded-pill gap-3",
  };
  
  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );
  
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={iconSize} className="animate-spin" />}
      {!loading && icon && iconPosition === "left" && <ApperIcon name={icon} size={iconSize} />}
      {children}
      {!loading && icon && iconPosition === "right" && <ApperIcon name={icon} size={iconSize} />}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;