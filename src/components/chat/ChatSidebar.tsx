"use client";

import { useState } from "react";
import { User, Bot, MessageCircle } from "lucide-react";
import Image from "next/image";

interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  imageUrl: string;
  isActive: boolean;
}

interface ChatSidebarProps {
  onPersonaSelect: (personaId: string) => void;
  selectedPersona?: string;
}

export function ChatSidebar({ onPersonaSelect, selectedPersona }: ChatSidebarProps) {
  const [personas] = useState<Persona[]>([
    {
      id: "hitesh",
      name: "Hitesh Choudhary",
      role: "Tech Educator",
      avatar: "HC",
      imageUrl: "https://i.ibb.co/HffNJ0bz/hiteshsir-400x400.jpg",
      isActive: true,
    },
    {
      id: "piyush",
      name: "Piyush Garg",
      role: "Tech Mentor",
      avatar: "PG",
      imageUrl: "https://i.ibb.co/FbZ1X3Cs/piyush-sir-400x400.jpg",
      isActive: true,
    },
  ]);

  return (
    <div className="w-80 border-r border-gray-700 bg-gray-900">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Personas</h2>
        <p className="text-sm text-gray-400 mt-1">Choose your AI companion</p>
      </div>
      
      <div className="p-4 space-y-2">
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onPersonaSelect(persona.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              selectedPersona === persona.id
                ? "bg-white text-black shadow-md"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={persona.imageUrl}
                  alt={persona.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-semibold text-sm" style={{ display: 'none' }}>
                  {persona.avatar}
                </div>
              </div>
              {persona.isActive && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{persona.name}</div>
              <div className="text-xs opacity-75">{persona.role}</div>
            </div>
            <MessageCircle size={16} className="opacity-60" />
          </button>
        ))}
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800 text-gray-300">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User size={16} className="text-gray-400" />
          </div>
          <div>
            <div className="font-medium text-sm">You</div>
            <div className="text-xs opacity-75">User</div>
          </div>
        </div>
      </div>
    </div>
  );
}
