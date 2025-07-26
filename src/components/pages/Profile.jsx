import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StreakCounter from "@/components/molecules/StreakCounter";
import XPProgress from "@/components/molecules/XPProgress";
import ApperIcon from "@/components/ApperIcon";
import { getCurrentUser } from "@/services/api/userService";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeClick = () => {
    toast.info("Premium upgrade coming soon! 🚀");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 gradient-pink-purple rounded-full mb-4 flex items-center justify-center mx-auto"
          >
            <span className="text-2xl">👤</span>
          </motion.div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const badges = [
    { id: 1, name: "First Memory", emoji: "🌟", unlocked: true },
    { id: 2, name: "7 Day Streak", emoji: "🔥", unlocked: user.streakCount >= 7 },
    { id: 3, name: "Chat Master", emoji: "💬", unlocked: false },
    { id: 4, name: "Time Keeper", emoji: "⏳", unlocked: false },
    { id: 5, name: "Memory Collector", emoji: "📜", unlocked: false },
    { id: 6, name: "Level 5", emoji: "🏆", unlocked: user.level >= 5 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="w-24 h-24 gradient-pink-purple rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <span className="text-4xl">👤</span>
          </motion.div>
          <h1 className="text-3xl font-display text-secondary mb-2">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 text-center">
              <StreakCounter streakCount={user.streakCount} className="justify-center" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <XPProgress xp={user.xpPoints} level={user.level} />
            </Card>
          </motion.div>
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h3 className="text-xl font-display text-secondary mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Achievements
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`text-center p-3 rounded-xl transition-all duration-200 ${
                    badge.unlocked 
                      ? "bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/30" 
                      : "bg-gray-50 border-2 border-gray-200"
                  }`}
                >
                  <span className={`text-3xl block mb-2 ${badge.unlocked ? "" : "filter grayscale opacity-50"}`}>
                    {badge.emoji}
                  </span>
                  <p className={`text-xs font-medium ${badge.unlocked ? "text-secondary" : "text-gray-400"}`}>
                    {badge.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Premium Upgrade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card gradient gradientType="excited" className="p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display mb-2">Upgrade to Premium</h3>
                <p className="text-white/90 text-sm mb-4">
                  Unlock unlimited memories, AI chats, and exclusive features!
                </p>
                <Button
                  variant="outline"
                  onClick={handleUpgradeClick}
                  className="border-white/30 text-white hover:bg-white hover:text-secondary"
                  icon="Crown"
                >
                  Upgrade Now
                </Button>
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
                className="text-5xl"
              >
                👑
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-display text-secondary mb-4 flex items-center gap-2">
              <ApperIcon name="Settings" size={24} />
              Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Notifications</span>
                <div className="w-12 h-6 bg-accent rounded-pill relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Dark Mode</span>
                <div className="w-12 h-6 bg-gray-300 rounded-pill relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;