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
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(false);
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
// Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        toast.success("Voice message captured! 🎤");
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone permission denied. Please allow microphone access.");
        } else if (event.error === 'no-speech') {
          toast.error("No speech detected. Please try again.");
        } else {
          toast.error("Voice recognition failed. Please try again.");
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }
  };

  // Start listening
  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error("Failed to start voice recognition. Please try again.");
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  // Set up speech recognition on mount
  useEffect(() => {
    initializeSpeechRecognition();
  }, []);
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
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-pill bg-white focus:border-primary focus:ring-0 focus:outline-none transition-colors duration-200 placeholder:text-gray-400"
            />
            {speechSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={isListening ? "Stop recording" : "Start voice recording"}
              >
                <ApperIcon 
                  name={isListening ? "MicOff" : "Mic"} 
                  size={16}
                  className={isListening ? "animate-pulse" : ""}
                />
              </button>
            )}
          </div>
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