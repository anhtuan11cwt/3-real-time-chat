"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-dvh flex justify-center items-center px-4">
      <div className="max-w-[400px] w-full">
        <div className="flex justify-center text-indigo-500">
          <AiFillMessage size={48} />
        </div>

        <h2 className="text-center text-2xl font-bold my-6 text-gray-300">
          Tạo tài khoản mới
        </h2>

        <div className="py-10 px-6 rounded-xl shadow-lg bg-[#0f172a] border border-gray-800">
          <form className="space-y-3">
            <input
              className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Tên người dùng"
              type="text"
            />

            <input
              className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Địa chỉ email"
              type="text"
            />

            <div className="relative">
              <input
                className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition pr-12"
                placeholder="Mật khẩu"
                type={showPassword ? "text" : "password"}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition pr-12"
                placeholder="Xác nhận mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                type="button"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              className="w-full py-3 rounded-lg text-white font-medium
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-600 hover:to-purple-700
                         transition-all duration-200"
              type="submit"
            >
              Đăng ký
            </button>

            <p className="text-center text-sm text-gray-400">
              Đã có tài khoản?
              <Link className="ml-2 text-indigo-500 hover:underline" href="/">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
