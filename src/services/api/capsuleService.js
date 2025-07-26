import capsulesData from "@/services/mockData/capsules.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 350));

let capsules = [...capsulesData];

export const getAllCapsules = async () => {
  await delay();
  return capsules.sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate));
};

export const getCapsuleById = async (id) => {
  await delay();
  const capsule = capsules.find(c => c.Id === parseInt(id));
  if (!capsule) {
    throw new Error("Capsule not found");
  }
  return { ...capsule };
};

export const createCapsule = async (capsuleData) => {
  await delay();
  
  const newCapsule = {
    Id: Math.max(...capsules.map(c => c.Id)) + 1,
    userId: "1",
    message: capsuleData.message,
    unlockDate: capsuleData.unlockDate,
    recipientEmail: capsuleData.recipientEmail,
    isUnlocked: capsuleData.isUnlocked || false,
    createdAt: new Date().toISOString()
  };
  
  capsules.push(newCapsule);
  return { ...newCapsule };
};

export const updateCapsule = async (id, updates) => {
  await delay();
  
  const index = capsules.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Capsule not found");
  }
  
  capsules[index] = { ...capsules[index], ...updates };
  return { ...capsules[index] };
};

export const deleteCapsule = async (id) => {
  await delay();
  
  const index = capsules.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Capsule not found");
  }
  
  capsules.splice(index, 1);
  return true;
};