"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AiFillCamera, AiFillMessage } from "react-icons/ai";

interface User {
  bio: string | null;
  profileImage: string | null;
}

export default function SetupProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<User>({ bio: "", profileImage: "" });
  const [avatar, setAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();

        if (res.ok) {
          setUserData({
            bio: data.bio || "",
            profileImage: data.profileImage || "",
          });
          if (data.profileImage) {
            setAvatar(data.profileImage);
          }
        }
      } catch {
        // Xử lý lỗi
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const imageUrl = URL.createObjectURL(selected);
      setAvatar(imageUrl);
      setFile(selected);
    }
  };

  const uploadImage = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      body: formData,
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload thất bại");
    }

    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      let imageUrl = userData.profileImage;
      if (file) {
        imageUrl = await uploadImage();
      }

      const res = await fetch("/api/user/setup-profile", {
        body: JSON.stringify({
          bio: userData.bio,
          profileImage: imageUrl,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Thiết lập thất bại");
      }

      router.push("/chat");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-dvh flex justify-center items-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4">
      <div className="max-w-[400px] w-full">
        <div className="flex justify-center text-indigo-500">
          <AiFillMessage size={48} />
        </div>

        <h2 className="text-center text-2xl font-bold my-6 text-gray-300">
          Thiết lập hồ sơ
        </h2>

        <div className="py-10 px-6 rounded-xl shadow-lg bg-[#0f172a] border border-gray-800">
          <div className="flex justify-center mb-6">
            <button
              aria-label="Chọn ảnh đại diện"
              className="w-24 h-24 rounded-full bg-inputBg overflow-hidden cursor-pointer flex items-center justify-center border-2 border-gray-700 hover:border-indigo-500 transition group relative"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              {avatar ? (
                <Image
                  alt="avatar"
                  className="object-cover"
                  fill
                  sizes="96px"
                  src={avatar}
                  unoptimized
                />
              ) : (
                <AiFillCamera
                  className="text-gray-500 group-hover:text-indigo-500 transition"
                  size={32}
                />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
                <span className="text-xs text-white">Đổi ảnh</span>
              </div>
            </button>

            <input
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}
              type="file"
            />
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <textarea
              className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition resize-none"
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
              placeholder="Giới thiệu ngắn về bản thân..."
              rows={3}
              value={userData.bio || ""}
            />

            <button
              className="w-full py-3 rounded-lg text-white font-medium
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-600 hover:to-purple-700
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? "Đang xử lý..." : "Tiếp tục"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
