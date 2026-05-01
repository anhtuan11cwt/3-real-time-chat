"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng");
        return;
      }

      router.push("/chat");
    } catch {
      setError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex justify-center items-center px-4">
      <div className="max-w-[400px] w-full">
        <div className="flex justify-center text-indigo-500">
          <AiFillMessage size={48} />
        </div>

        <h2 className="text-center text-2xl font-bold my-6 text-gray-300">
          Đăng nhập vào tài khoản
        </h2>

        <div className="py-10 px-6 rounded-xl shadow-lg bg-[#0f172a] border border-gray-800">
          <form className="space-y-3" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <input
              className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ email"
              type="text"
              value={email}
            />

            <div className="relative">
              <input
                className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition pr-12"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              className="w-full py-3 rounded-lg text-white font-medium
                         bg-gradient-to-r from-indigo-500 to-purple-600
                         hover:from-indigo-600 hover:to-purple-700
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Chưa có tài khoản?
              <Link
                className="ml-2 text-indigo-500 hover:underline"
                href="/sign-up"
              >
                Đăng ký
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
