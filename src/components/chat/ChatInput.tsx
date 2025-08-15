"use client";

import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="border-t border-gray-700 p-6 bg-black">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 font-medium shadow-sm"
          disabled={isLoading}
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
