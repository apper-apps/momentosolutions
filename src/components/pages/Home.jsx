import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/userSlice";
import { toast } from "react-toastify";
import { updateUserStats } from "@/services/api/userService";
import DailyPrompt from "@/components/molecules/DailyPrompt";
import StreakCounter from "@/components/molecules/StreakCounter";
import XPProgress from "@/components/molecules/XPProgress";
import AddMemoryModal from "@/components/organisms/AddMemoryModal";
import Loading from "@/components/ui/Loading";
import Chat from "@/components/pages/Chat";
import Button from "@/components/atoms/Button";

const Home = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setGreeting(getTimeBasedGreeting());
  }, [isAuthenticated, navigate]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

const handleMemoryAdded = async (newMemory) => {
    try {
      // Update user stats
      const updatedUser = await updateUserStats(user.Id, {
        xpPoints: (user.xpPoints || 0) + 50,
        streakCount: (user.streakCount || 0) + 1
      });
      if (updatedUser) {
        dispatch(setUser({ ...user, ...updatedUser }));
      }
      toast.success("Great job! You earned 50 XP! 🌟");
    } catch (error) {
      console.error("Failed to update user stats:", error);
      toast.error("Memory saved, but couldn't update stats");
    }
  };
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 gradient-pink-purple rounded-full mb-4 flex items-center justify-center mx-auto"
          >
            <span className="text-2xl">🤗</span>
          </motion.div>
          <p className="text-gray-600">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-8">
        {/* Header */}
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
            className="text-6xl mb-4"
          >
            🤗
          </motion.div>
<h1 className="text-3xl font-display text-secondary mb-2">
            {greeting}, {user.firstName || user.Name || 'Friend'}!
          </h1>
          <p className="text-gray-600">Ready to save a moment today?</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8 bg-white rounded-2xl p-6 shadow-soft"
        >
<StreakCounter streakCount={user.streakCount || 0} />
          <div className="w-px h-12 bg-gray-200" />
<XPProgress 
            xp={user.xpPoints || 0} 
            level={user.level || 1} 
            className="flex-1 ml-6"
          />
        </motion.div>

        {/* Daily Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <DailyPrompt onStartWriting={() => setShowAddMemory(true)} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <Button
            variant="secondary"
            className="h-24 flex-col"
            onClick={() => setShowAddMemory(true)}
            icon="Plus"
          >
            <span className="mt-2">Add Memory</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => window.location.href = "/chat"}
            icon="MessageCircle"
          >
            <span className="mt-2">Chat with AI</span>
          </Button>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm italic">
            "Every moment matters. Let's capture today's magic together! ✨"
          </p>
        </motion.div>
      </div>

      <AddMemoryModal
        isOpen={showAddMemory}
        onClose={() => setShowAddMemory(false)}
        onMemoryAdded={handleMemoryAdded}
      />
    </div>
  );
};

export default Home;