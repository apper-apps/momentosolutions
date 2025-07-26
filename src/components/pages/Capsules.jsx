import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CapsuleCard from "@/components/molecules/CapsuleCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AddCapsuleModal from "@/components/organisms/AddCapsuleModal";
import { getAllCapsules } from "@/services/api/capsuleService";

const Capsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCapsule, setShowAddCapsule] = useState(false);

  useEffect(() => {
    loadCapsules();
  }, []);

  const loadCapsules = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllCapsules();
      setCapsules(data);
    } catch (err) {
      setError("Failed to load capsules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCapsuleAdded = (newCapsule) => {
    setCapsules(prev => [newCapsule, ...prev]);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCapsules} />;

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
              Time Capsules
            </h1>
            <p className="text-gray-600">
              {capsules.length} messages waiting for the future ⏳
            </p>
          </div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="text-4xl"
          >
            🎁
          </motion.div>
        </motion.div>

        {/* Capsules Grid */}
        {capsules.length === 0 ? (
          <Empty
            title="No time capsules yet"
            description="Create your first time capsule and send a message to your future self!"
            actionText="Create Time Capsule"
            onAction={() => setShowAddCapsule(true)}
            icon="Clock"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {capsules.map((capsule, index) => (
              <motion.div
                key={capsule.Id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <CapsuleCard
                  capsule={capsule}
                  onClick={() => console.log("View capsule:", capsule.Id)}
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
            onClick={() => setShowAddCapsule(true)}
            className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl"
            icon="Plus"
          />
        </motion.div>
      </div>

      <AddCapsuleModal
        isOpen={showAddCapsule}
        onClose={() => setShowAddCapsule(false)}
        onCapsuleAdded={handleCapsuleAdded}
      />
    </div>
  );
};

export default Capsules;