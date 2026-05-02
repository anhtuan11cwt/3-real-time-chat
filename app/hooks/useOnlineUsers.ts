"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/app/lib/pusherClient";

interface PusherMember {
  id: string;
  info?: {
    name?: string;
    image?: string;
  };
}

interface PusherMembers {
  each: (callback: (member: PusherMember) => void) => void;
}

export const useOnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!pusherClient) return;

    const channel = pusherClient.subscribe("presence-online-users");

    // Khi subscribe xong → lấy danh sách hiện tại
    channel.bind("pusher:subscription_succeeded", (members: PusherMembers) => {
      const users: string[] = [];

      members.each((member: PusherMember) => {
        users.push(member.id);
      });

      setOnlineUsers(users);
    });

    // Người dùng trực tuyến
    channel.bind("pusher:member_added", (member: PusherMember) => {
      setOnlineUsers((prev) => [...new Set([...prev, member.id])]);
    });

    // Người dùng ngoại tuyến
    channel.bind("pusher:member_removed", (member: PusherMember) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== member.id));
    });

    return () => {
      pusherClient?.unsubscribe("presence-online-users");
    };
  }, []);

  return onlineUsers;
};
