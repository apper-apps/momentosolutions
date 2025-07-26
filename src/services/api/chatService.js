import chatData from "@/services/mockData/chatMessages.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

let messages = [...chatData];

export const getAllChatMessages = async () => {
  await delay();
  return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

export const sendChatMessage = async (content, role = "user") => {
  await delay();
  
  const newMessage = {
    Id: Math.max(...messages.map(m => m.Id)) + 1,
    userId: "1",
    role: role,
    content: content,
    timestamp: new Date().toISOString(),
    contextMemoryIds: []
  };
  
  messages.push(newMessage);
  return { ...newMessage };
};

export const clearChatHistory = async () => {
  await delay();
  messages = [];
  return true;
};

export const getChatMessageById = async (id) => {
  await delay();
  const message = messages.find(m => m.Id === parseInt(id));
  if (!message) {
    throw new Error("Message not found");
  }
  return { ...message };
};