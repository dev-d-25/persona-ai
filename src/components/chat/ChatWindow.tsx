"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Persona {
  id: string;
  name: string;
  role: string;
  personality: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>("hitesh");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const personas: Record<string, Persona> = {
    hitesh: {
      id: "hitesh",
      name: "Hitesh Choudhary",
      role: "Tech Educator",
      personality: "I'm Hitesh Choudhary, a passionate tech educator and content creator. I love teaching programming concepts in simple, practical ways."
    },
    piyush: {
      id: "piyush",
      name: "Piyush Garg",
      role: "Tech Mentor",
      personality: "I'm Piyush Garg, a tech mentor and software engineer. I specialize in system design, backend development, and helping developers understand complex technical concepts."
    }
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          persona: selectedPersona
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    // Clear messages when switching personas
    setMessages([]);
    
    // Add a welcome message from the new persona
    const newPersona = personas[personaId];
    if (newPersona) {
      setTimeout(() => {
        if (personaId === "hitesh") {
          setMessages([{
            role: "assistant",
            content: "Haanji Namaste doston, chai leke baith jao aur shuru karte hain! I'm Hitesh Choudhary, your tech educator. How can I help you with coding today?"
          }]);
        } else {
          setMessages([{
            role: "assistant",
            content: `Hi! I'm ${newPersona.name}, your ${newPersona.role.toLowerCase()}. ${newPersona.personality} How can I help you today?`
          }]);
        }
      }, 100);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black">
      {/* Sidebar */}
      <ChatSidebar 
        onPersonaSelect={handlePersonaSelect}
        selectedPersona={selectedPersona}
      />
      
      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="border-b border-gray-700 px-6 py-4 bg-gray-900">
          <h1 className="text-lg font-semibold text-white">Chat with {personas[selectedPersona]?.name}</h1>
          <p className="text-sm text-gray-400">{personas[selectedPersona]?.role}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">No messages yet</h3>
                <p className="text-gray-400">Start a conversation by typing a message below.</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <ChatMessage role={msg.role} content={msg.content} />
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm">
                {personas[selectedPersona]?.name} is typing...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
