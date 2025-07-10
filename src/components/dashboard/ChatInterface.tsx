import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  PhotoIcon,
  DocumentIcon,
  SparklesIcon,
  UserIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: string; url: string }[];
  isTyping?: boolean;
  confidence?: number;
  suggestions?: string[];
}

interface ChatInterfaceProps {
  className?: string;
  isMinimized?: boolean;
  onToggle?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  className = "",
  isMinimized = false,
  onToggle,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample initial conversation
  const initialMessages: Message[] = [
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI medical assistant. I can help analyze lab results, interpret medical data, and provide insights. How can I assist you today?",
      timestamp: new Date(Date.now() - 60000),
      confidence: 95,
      suggestions: [
        "Analyze recent lab results",
        "Explain abnormal values",
        "Drug interaction check",
      ],
    },
    {
      id: "2",
      type: "user",
      content: "Can you help me understand the elevated troponin levels?",
      timestamp: new Date(Date.now() - 30000),
    },
    {
      id: "3",
      type: "ai",
      content:
        "Elevated troponin levels indicate potential cardiac muscle damage. Based on the current readings, this suggests acute myocardial infarction. I recommend immediate cardiology consultation and continuous monitoring.",
      timestamp: new Date(Date.now() - 10000),
      confidence: 92,
      suggestions: [
        "Show treatment protocols",
        "Risk assessment",
        "Similar cases",
      ],
    },
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        type: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 20) + 80,
        suggestions: [
          "Get more details",
          "Show related cases",
          "Export report",
        ],
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      "Based on the medical data analysis, I can provide several insights. The pattern suggests a need for further investigation.",
      "The AI analysis indicates this is within normal parameters, but I recommend monitoring for any changes.",
      "This reading requires immediate attention. I've identified potential risk factors that need addressing.",
      "The neural network has processed this information and suggests three possible treatment pathways.",
      "According to the latest medical guidelines and AI analysis, this condition has a favorable prognosis with proper treatment.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (isMinimized) {
    return (
      <motion.div
        className={`fixed bottom-4 right-4 z-50 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <button
          onClick={onToggle}
          className="w-14 h-14 rounded-full glass-enhanced flex items-center justify-center glow-blue hover:scale-110 transition-transform"
        >
          <SparklesIcon className="w-6 h-6 text-medical-blue" />
          {messages.filter((m) => !m.isTyping).length > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-medical-red flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`glass-enhanced rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Chat Header */}
      <div className="p-4 border-b border-medical-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-medical-blue to-medical-purple glow-blue">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                AI Medical Assistant
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-medical-green animate-neural-pulse" />
                <span className="text-xs text-medical-green">Online</span>
              </div>
            </div>
          </div>

          {/* Chat Controls */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-medical-blue/20 transition-colors">
              <DocumentIcon className="w-4 h-4 text-medical-blue" />
            </button>
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-medical-red/20 transition-colors"
              >
                <span className="text-medical-red">−</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`max-w-[80%] ${
                message.type === "user" ? "order-2" : "order-1"
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`p-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-medical-blue text-white ml-4"
                    : "glass-card border border-medical-glass-border mr-4"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {/* AI Confidence Score */}
                {message.type === "ai" && message.confidence && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-medical-dark rounded-full overflow-hidden">
                      <div
                        className="h-full bg-medical-green"
                        style={{ width: `${message.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-medical-green">
                      {message.confidence}% confident
                    </span>
                  </div>
                )}

                {/* Message Timestamp */}
                <div className="mt-1 text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* AI Suggestions */}
              {message.type === "ai" && message.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="px-3 py-1 text-xs bg-medical-blue/20 text-medical-blue rounded-full hover:bg-medical-blue/30 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === "user" ? "order-1" : "order-2"
              } ${
                message.type === "user"
                  ? "bg-medical-blue"
                  : "bg-gradient-to-r from-medical-purple to-medical-teal"
              }`}
            >
              {message.type === "user" ? (
                <UserIcon className="w-4 h-4 text-white" />
              ) : (
                <ComputerDesktopIcon className="w-4 h-4 text-white" />
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass-card p-3 rounded-2xl mr-4 border border-medical-glass-border">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-medical-blue animate-bounce" />
                    <div
                      className="w-2 h-2 rounded-full bg-medical-blue animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-medical-blue animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-medical-glass-border">
        <div className="flex items-end gap-3">
          {/* File Upload */}
          <button className="p-2 rounded-lg hover:bg-medical-blue/20 transition-colors">
            <PhotoIcon className="w-5 h-5 text-medical-blue" />
          </button>

          {/* Voice Recording */}
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording
                ? "bg-medical-red/20 text-medical-red"
                : "hover:bg-medical-blue/20 text-medical-blue"
            }`}
          >
            <MicrophoneIcon
              className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`}
            />
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about medical data, lab results..."
              className="w-full px-4 py-2 bg-medical-dark/50 border border-medical-glass-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-medical-blue/50 focus:border-medical-blue transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="w-1 h-1 rounded-full bg-medical-blue animate-neural-pulse" />
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-2 rounded-lg bg-medical-blue hover:bg-medical-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {[
            "Analyze lab results",
            "Drug interactions",
            "Risk assessment",
            "Treatment options",
          ].map((action) => (
            <button
              key={action}
              onClick={() => setInputValue(action)}
              className="flex-shrink-0 px-3 py-1 text-xs bg-medical-blue/20 text-medical-blue rounded-full hover:bg-medical-blue/30 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Neural Network Animation Overlay */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20">
        <div className="relative w-full h-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-medical-blue"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
