import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { createMemory } from "@/services/api/memoryService";

const AddMemoryModal = ({ isOpen, onClose, onMemoryAdded }) => {
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("happy");
  const [isLoading, setIsLoading] = useState(false);

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", color: "gradient-mood-happy" },
    { id: "excited", emoji: "🎉", label: "Excited", color: "gradient-mood-excited" },
    { id: "calm", emoji: "😌", label: "Calm", color: "gradient-mood-calm" },
    { id: "love", emoji: "❤️", label: "Love", color: "gradient-mood-love" },
    { id: "sad", emoji: "😢", label: "Sad", color: "gradient-mood-sad" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Please write something about your memory!");
      return;
    }

    setIsLoading(true);
    try {
      const newMemory = await createMemory({
        content: content.trim(),
        mood: selectedMood,
        type: "text",
        tags: []
      });
      
      toast.success("Memory saved! 🌟");
      onMemoryAdded?.(newMemory);
      setContent("");
      setSelectedMood("happy");
      onClose();
    } catch (error) {
      toast.error("Failed to save memory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display text-secondary">Create Memory</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon="X"
                  className="text-gray-400 hover:text-gray-600"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How are you feeling?
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {moods.map((mood) => (
                      <motion.button
                        key={mood.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedMood === mood.id
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{mood.emoji}</span>
                        <span className="text-xs">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What happened?
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your memory..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-primary focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-gray-400 resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={isLoading}
                    icon="Heart"
                  >
                    Save Memory
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMemoryModal;