"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
  const onlineIds: string[] = [];

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
    <div className="w-[300px] h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <Image
              alt={session.user.name || "Người dùng"}
              className="w-10 h-10 rounded-full object-cover"
              height={40}
              src={session.user.image}
              width={40}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {session?.user?.name?.[0]?.toUpperCase() || "N"}
            </div>
          )}
          <span className="text-white font-medium">
            {session?.user?.name || session?.user?.email}
          </span>
        </div>

        <button
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
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
