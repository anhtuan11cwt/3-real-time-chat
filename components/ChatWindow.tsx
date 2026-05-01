"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  selectedUser: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  } | null;
}

interface Message {
  createdAt: Date;
  id: string;
  receiverId: string;
  senderId: string;
  text: string;
}

export default function ChatWindow({ selectedUser }: ChatWindowProps) {
  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">👋</p>
          <p>Chọn một người dùng để bắt đầu chat</p>
        </div>
      </div>
    );
  }

  return <ActiveChatWindow selectedUser={selectedUser} />;
}

function ActiveChatWindow({
  selectedUser,
}: {
  selectedUser: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      createdAt: new Date(),
      id: Date.now().toString(),
      receiverId: selectedUser.id,
      senderId: "current-user",
      text: message,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        {selectedUser.profileImage ? (
          <Image
            alt={selectedUser.name || selectedUser.email}
            className="w-10 h-10 rounded-full object-cover"
            height={40}
            src={selectedUser.profileImage}
            width={40}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
            {selectedUser.name?.[0]?.toUpperCase() ||
              selectedUser.email[0].toUpperCase()}
          </div>
        )}
        <div>
          <span className="text-white font-medium block">
            {selectedUser.name || selectedUser.email}
          </span>
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
            Trực tuyến
          </span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            isOwnMessage={msg.senderId === "current-user"}
            key={msg.id}
            message={msg}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-slate-800 flex items-center gap-2">
        <input
          className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          type="text"
          value={message}
        />
        <button
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!message.trim()}
          onClick={handleSendMessage}
          type="button"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
}
