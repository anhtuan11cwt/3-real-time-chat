"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AiFillCamera, AiFillMessage } from "react-icons/ai";

export default function SetupProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

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
              aria-label="Chon anh dai dien"
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

          <form className="space-y-3">
            <input
              className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Họ và tên"
              type="text"
            />

            <textarea
              className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition resize-none"
              placeholder="Giới thiệu ngắn về bản thân..."
              rows={3}
            />

            <button
              className="w-full py-3 rounded-lg text-white font-medium
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-600 hover:to-purple-700
                         transition-all duration-200"
              type="submit"
            >
              Tiếp tục
            </button>

            <p className="text-center text-sm text-gray-400">
              <Link className="text-indigo-500 hover:underline" href="/">
                Bỏ qua
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
