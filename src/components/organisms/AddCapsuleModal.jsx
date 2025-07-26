import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { format, addDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { createCapsule } from "@/services/api/capsuleService";

const AddCapsuleModal = ({ isOpen, onClose, onCapsuleAdded }) => {
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"));
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please write a message for your future self!");
      return;
    }

    if (new Date(unlockDate) <= new Date()) {
      toast.error("Please select a future date!");
      return;
    }

    setIsLoading(true);
    try {
      const newCapsule = await createCapsule({
        message: message.trim(),
        unlockDate,
        recipientEmail: recipientEmail.trim() || null,
        isUnlocked: false
      });
      
      toast.success("Time capsule created! ⏳✨");
      onCapsuleAdded?.(newCapsule);
      setMessage("");
      setUnlockDate(format(addDays(new Date(), 30), "yyyy-MM-dd"));
      setRecipientEmail("");
      onClose();
    } catch (error) {
      toast.error("Failed to create capsule. Please try again.");
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
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⏳</span>
                  <h2 className="text-2xl font-display text-secondary">Create Time Capsule</h2>
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Future You
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message to your future self..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:border-primary focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-gray-400 resize-none"
                    disabled={isLoading}
                  />
                </div>

                <Input
                  type="date"
                  label="Unlock Date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                  disabled={isLoading}
                />

                <Input
                  type="email"
                  label="Email Reminder (Optional)"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />

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
                    icon="Clock"
                  >
                    Create Capsule
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

export default AddCapsuleModal;