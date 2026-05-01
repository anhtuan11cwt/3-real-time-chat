"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

interface ApiMessage {
  body: string;
  createdAt: string;
  id: string;
  receiver?: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  receiverId: string;
  sender?: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  senderId: string;
}

interface Message {
  createdAt: string;
  id: string;
  receiver?: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  receiverId: string;
  sender?: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
  senderId: string;
  text: string;
}

export default function ChatWindow({ selectedUser }: ChatWindowProps) {
  if (!selectedUser) {
    return (
      <div className="flex flex-1 justify-center items-center bg-slate-950">
        <div className="text-gray-500 text-center">
          <p className="mb-2 text-xl">👋</p>
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
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/messages/${selectedUser.id}`);

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy tin nhắn: ${response.status}`);
      }

      const data = await response.json();
      // Ánh xạ phản hồi API (body) sang giao diện component (text)
      const mappedMessages = data.map((msg: ApiMessage) => ({
        ...msg,
        text: msg.body, // Map body to text for MessageBubble
      }));
      setMessages(mappedMessages);
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedUser.id]);

  // Fetch messages when selected user changes
  useEffect(() => {
    if (selectedUser?.id && session?.user?.id) {
      // Use setTimeout to avoid cascading renders
      const timeoutId = setTimeout(() => {
        fetchMessages();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedUser?.id, session?.user?.id, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !session?.user?.id) return;

    const tempMessage: Message = {
      createdAt: new Date().toISOString(),
      id: `temp-${Date.now()}`,
      receiverId: selectedUser.id,
      senderId: session.user.id,
      text: message, // Use text instead of body
    };

    // Add optimistic update
    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = message;
    setMessage("");

    try {
      const response = await fetch("/api/messages/send", {
        body: JSON.stringify({
          message: messageToSend,
          receiverId: selectedUser.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi gửi tin nhắn: ${response.status}`);
      }

      const newMessage = await response.json();

      // Khớp phản hồi API với giao diện component
      const mappedMessage = {
        ...newMessage,
        text: (newMessage as { body: string }).body, // Map body to text for MessageBubble
      };

      // Replace temp message with real message
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? mappedMessage : msg)),
      );
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setMessage(messageToSend); // Restore message text
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-slate-950 h-full">
      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 border-slate-800 border-b">
        {selectedUser.profileImage ? (
          <Image
            alt={selectedUser.name || selectedUser.email}
            className="rounded-full w-10 h-10 object-cover"
            height={40}
            src={selectedUser.profileImage}
            width={40}
          />
        ) : (
          <div className="flex justify-center items-center bg-slate-700 rounded-full w-10 h-10 font-medium text-white">
            {selectedUser.name?.[0]?.toUpperCase() ||
              selectedUser.email[0].toUpperCase()}
          </div>
        )}
        <div>
          <span className="block font-medium text-white">
            {selectedUser.name || selectedUser.email}
          </span>
          <span className="flex items-center gap-1 text-green-500 text-xs">
            <span className="inline-block bg-green-500 rounded-full w-2 h-2" />
            Trực tuyến
          </span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 space-y-2 p-4 overflow-y-auto">
        {loading ? (
          <div className="text-gray-500 text-center">
            <p>Đang tải tin nhắn...</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              isOwnMessage={msg.senderId === session?.user?.id}
              key={msg.id}
              message={msg}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 p-4 border-slate-800 border-t">
        <input
          className="flex-1 bg-slate-800 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          type="text"
          value={message}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition-colors disabled:cursor-not-allowed"
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
