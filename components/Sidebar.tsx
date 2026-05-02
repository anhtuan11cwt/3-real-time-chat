"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useOnlineUsers } from "@/app/hooks/useOnlineUsers";
import UserItem from "./UserItem";

interface SidebarProps {
  onSelectUser?: (user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  }) => void;
}

export default function Sidebar({ onSelectUser }: SidebarProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<
    {
      id: string;
      name: string | null;
      email: string;
      profileImage: string | null;
    }[]
  >([]);
  const onlineIds = useOnlineUsers();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      }
    };

    fetchUsers();
  }, []);

  const isUserOnline = (userId: string) => onlineIds.includes(userId);

  return (
    <div className="flex flex-col bg-slate-900 border-slate-800 border-r w-[300px] h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-slate-800 border-b">
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <Image
              alt={session.user.name || "Người dùng"}
              className="rounded-full w-10 h-10 object-cover"
              height={40}
              src={session.user.image}
              width={40}
            />
          ) : (
            <div className="flex justify-center items-center bg-indigo-600 rounded-full w-10 h-10 font-medium text-white">
              {session?.user?.name?.[0]?.toUpperCase() || "N"}
            </div>
          )}
          <span className="font-medium text-white">
            {session?.user?.name || session?.user?.email}
          </span>
        </div>

        <button
          className="text-red-400 hover:text-red-300 text-sm transition-colors"
          onClick={() => signOut({ callbackUrl: "/" })}
          type="button"
        >
          Đăng xuất
        </button>
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <UserItem
            isOnline={isUserOnline(user.id)}
            key={user.id}
            onClick={() => onSelectUser?.(user)}
            user={user}
          />
        ))}
        {users.length === 0 && (
          <div className="p-4 text-gray-500 text-center">
            Không có người dùng nào
          </div>
        )}
      </div>
    </div>
  );
}
