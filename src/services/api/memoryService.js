import memoriesData from "@/services/mockData/memories.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 400));

let memories = [...memoriesData];

export const getAllMemories = async () => {
  await delay();
  return memories.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getMemoryById = async (id) => {
  await delay();
  const memory = memories.find(m => m.Id === parseInt(id));
  if (!memory) {
    throw new Error("Memory not found");
  }
  return { ...memory };
};

export const createMemory = async (memoryData) => {
  await delay();
  
  const newMemory = {
    Id: Math.max(...memories.map(m => m.Id)) + 1,
    userId: "1",
    content: memoryData.content,
    type: memoryData.type || "text",
    mood: memoryData.mood || "default",
    timestamp: new Date().toISOString(),
    tags: memoryData.tags || [],
    reactions: []
  };
  
  memories.unshift(newMemory);
  return { ...newMemory };
};

export const updateMemory = async (id, updates) => {
  await delay();
  
  const index = memories.findIndex(m => m.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Memory not found");
  }
  
  memories[index] = { ...memories[index], ...updates };
  return { ...memories[index] };
};

export const deleteMemory = async (id) => {
  await delay();
  
  const index = memories.findIndex(m => m.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Memory not found");
  }
  
  memories.splice(index, 1);
  return true;
};