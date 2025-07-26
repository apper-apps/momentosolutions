import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "",
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  const inputClasses = cn(
    "w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white",
    "focus:border-primary focus:ring-0 focus:outline-none transition-colors duration-200",
    "placeholder:text-gray-400",
    error && "border-error",
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;