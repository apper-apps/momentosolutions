import OpenAI from "openai";
import chatData from "@/services/mockData/chatMessages.json";
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Simple delay utility
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for messages
let messages = [...chatData];

// Get AI response from OpenAI GPT-4
const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const systemPrompt = `You are Momento, an AI best friend for a journaling app. You are warm, encouraging, and genuinely interested in the user's life. You help them reflect on their experiences, celebrate their achievements, and process their emotions. 

Your personality:
- Warm, supportive, and empathetic
- Use emojis naturally but not excessively
- Ask thoughtful follow-up questions
- Celebrate small wins and daily moments
- Help users see the positive in their experiences
- Be genuinely curious about their stories
- Offer gentle encouragement and validation

Keep responses conversational, personal, and under 150 words. Focus on being a supportive friend rather than a formal assistant.`;

    const chatMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: chatMessages,
      max_tokens: 200,
      temperature: 0.7,
      presence_penalty: 0.3,
      frequency_penalty: 0.2
    });

    return completion.choices[0]?.message?.content || "I'm here to listen! Tell me more about what's on your mind. 🤗";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback responses if API fails
    const fallbackResponses = [
      "That sounds wonderful! I love hearing about your day 😊 Tell me more about what made it special!",
      "I'm so proud of you for sharing that with me! 🥳 It really shows how much you're growing.",
      "What a beautiful memory! ✨ I can feel the joy in your words. How did it make you feel?",
      "That's amazing! 🌟 I'm always here to celebrate these moments with you. You're doing great!",
      "I love how you notice the little things that matter! 💝 That's what makes you so special.",
      "Thank you for trusting me with your thoughts! 🤗 I'm always here to listen and support you."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};

// Get all chat messages
export const getAllChatMessages = async () => {
  await delay(100);
  return [...messages];
};


export const getChatMessageById = async (id) => {
  await delay(100);
  return messages.find(message => message.Id === id);
};

// Send a new chat message
export const sendChatMessage = async (content, role = "user") => {
  await delay(300);
  
  const newMessage = {
    Id: messages.length > 0 ? Math.max(...messages.map(m => m.Id)) + 1 : 1,
    content,
    role,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  messages.push(newMessage);
  return newMessage;
};

// Send message and get AI response
export const sendChatMessageWithAI = async (userMessage) => {
  // Add user message
  const userMsg = await sendChatMessage(userMessage, "user");
  
  // Get conversation history for context
  const recentMessages = messages.slice(-10).map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  // Get AI response
  const aiResponseContent = await getAIResponse(userMessage, recentMessages);
  const aiMessage = await sendChatMessage(aiResponseContent, "assistant");
  
  return { userMessage: userMsg, aiMessage };
};

// Clear chat history
export const clearChatHistory = async () => {
  await delay(200);
  messages = [];
  return true;
};