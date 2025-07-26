import React from "react";
import { motion } from "framer-motion";
import NavigationItem from "@/components/molecules/NavigationItem";

const BottomNavigation = () => {
  const navItems = [
    { to: "/", icon: "Home", label: "Home", emoji: "🏠" },
    { to: "/memories", icon: "BookOpen", label: "Memories", emoji: "📜" },
    { to: "/chat", icon: "MessageCircle", label: "Chat", emoji: "💬" },
    { to: "/capsules", icon: "Clock", label: "Capsules", emoji: "⏳" },
    { to: "/profile", icon: "User", label: "Profile", emoji: "👤" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <NavigationItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            emoji={item.emoji}
          />
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;