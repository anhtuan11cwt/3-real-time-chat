"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/Sidebar";

export default function ChatPage() {
  const { status } = useSession();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Sidebar onSelectUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} />
    </>
  );
}
