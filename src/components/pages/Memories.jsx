import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MemoryCard from "@/components/molecules/MemoryCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AddMemoryModal from "@/components/organisms/AddMemoryModal";
import { getAllMemories } from "@/services/api/memoryService";

const Memories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddMemory, setShowAddMemory] = useState(false);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllMemories();
      setMemories(data);
    } catch (err) {
      setError("Failed to load memories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMemoryAdded = (newMemory) => {
    setMemories(prev => [newMemory, ...prev]);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMemories} />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-display text-secondary mb-2">
              Your Memories
            </h1>
            <p className="text-gray-600">
              {memories.length} precious moments captured 📜
            </p>
          </div>
          
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-4xl"
          >
            💝
          </motion.div>
        </motion.div>

        {/* Memories List */}
        {memories.length === 0 ? (
          <Empty
            title="No memories yet"
            description="Start capturing beautiful moments and create your personal timeline!"
            actionText="Create First Memory"
            onAction={() => setShowAddMemory(true)}
            icon="Heart"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {memories.map((memory, index) => (
              <motion.div
                key={memory.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MemoryCard
                  memory={memory}
                  onClick={() => console.log("View memory:", memory.Id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Floating Add Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <Button
            onClick={() => setShowAddMemory(true)}
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl"
            icon="Plus"
          />
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

export default Memories;