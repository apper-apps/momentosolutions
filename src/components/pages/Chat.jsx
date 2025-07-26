import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatBubble from "@/components/molecules/ChatBubble";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getAllChatMessages, sendChatMessageWithAI } from "@/services/api/chatService";
import { toast } from "react-toastify";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllChatMessages();
      setMessages(data);
    } catch (err) {
      setError("Failed to load chat history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const userMessage = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      // Show typing indicator immediately
      setIsTyping(true);
      
      // Send message and get AI response
      const { userMessage: userMsg, aiMessage } = await sendChatMessageWithAI(userMessage);
      
      // Add user message first
      setMessages(prev => [...prev, userMsg]);
      
      // Add small delay for better UX, then add AI response
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, aiMessage]);
        toast.success("Message sent successfully! 💬");
      }, 1000);

    } catch (error) {
      setIsTyping(false);
      toast.error("Failed to send message. Please check your API key and try again.");
      console.error('Chat error:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMessages} />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm px-4 py-6 border-b border-gray-100"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="w-12 h-12 gradient-pink-purple rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">🤗</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-display text-secondary">Momento AI</h1>
            <p className="text-sm text-accent">Your empathetic best friend</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-20">
{messages.length === 0 ? (
          <Empty
            title="Start a conversation!"
            description="Hi there! I'm Momento, your AI best friend powered by GPT-4! Share what's on your mind and let's chat! 🤗✨"
            actionText="Say Hello"
            onAction={() => setNewMessage("Hello Momento! How are you today?")}
            icon="MessageCircle"
          />
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatBubble
                key={message.Id}
                message={message}
                isUser={message.role === "user"}
              />
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 gradient-pink-purple rounded-full flex items-center justify-center">
                  <span className="text-lg">🤗</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-soft">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex gap-1"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-100 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={sending}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-pill bg-white focus:border-primary focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-gray-400"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            loading={sending}
            className="px-6 rounded-pill"
            icon="Send"
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;