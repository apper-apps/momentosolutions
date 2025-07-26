import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'chat_message';

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
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'content' } },
        { field: { Name: 'role' } },
        { field: { Name: 'timestamp' } },
        { field: { Name: 'contextMemoryIds' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'userId' } }
      ],
      orderBy: [
        {
          fieldName: 'timestamp',
          sorttype: 'ASC'
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error("Error fetching chat messages:", response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching chat messages:", error?.response?.data?.message);
    } else {
      console.error("Error fetching chat messages:", error.message);
    }
    throw error;
  }
};

export const getChatMessageById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'content' } },
        { field: { Name: 'role' } },
        { field: { Name: 'timestamp' } },
        { field: { Name: 'contextMemoryIds' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'userId' } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(`Error fetching chat message with ID ${id}:`, response.message);
      throw new Error(response.message);
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching chat message with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching chat message with ID ${id}:`, error.message);
    }
    throw error;
  }
};

// Send a new chat message
export const sendChatMessage = async (content, role = "user") => {
  try {
    // Only include updateable fields
    const updateableData = {
      Name: content.substring(0, 50) || 'Chat Message',
      content: content,
      role: role,
      timestamp: new Date().toISOString(),
      contextMemoryIds: '',
      Tags: '',
      userId: parseInt(1) // Default user ID
    };

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error sending chat message:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to send chat messages ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error sending chat message:", error?.response?.data?.message);
    } else {
      console.error("Error sending chat message:", error.message);
    }
    throw error;
  }
};

// Send message and get AI response
export const sendChatMessageWithAI = async (userMessage) => {
  try {
    // Add user message
    const userMsg = await sendChatMessage(userMessage, "user");
    
    // Get conversation history for context
    const allMessages = await getAllChatMessages();
    const recentMessages = allMessages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Get AI response
    const aiResponseContent = await getAIResponse(userMessage, recentMessages);
    const aiMessage = await sendChatMessage(aiResponseContent, "assistant");
    
    return { userMessage: userMsg, aiMessage };
  } catch (error) {
    console.error("Error in sendChatMessageWithAI:", error.message);
    throw error;
  }
};

// Clear chat history
export const clearChatHistory = async () => {
  try {
    // Get all messages first
    const allMessages = await getAllChatMessages();
    
    if (allMessages.length === 0) {
      return true;
    }

    // Delete all messages
    const messageIds = allMessages.map(msg => msg.Id);
    const params = {
      RecordIds: messageIds
    };

    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error clearing chat history:", response.message);
      throw new Error(response.message);
    }

    return true;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error clearing chat history:", error?.response?.data?.message);
    } else {
      console.error("Error clearing chat history:", error.message);
    }
    throw error;
  }
};