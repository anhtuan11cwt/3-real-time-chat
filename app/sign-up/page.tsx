"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillMessage } from "react-icons/ai";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/sign-up", {
        body: JSON.stringify({ email, name, password }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đăng ký thất bại");
        return;
      }

      router.push("/setup-profile");
    } catch {
      setError("Có lỗi xảy ra, thử lại sau");
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
          Tạo tài khoản mới
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
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên người dùng"
              type="text"
              value={name}
            />

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

            <div className="relative">
              <input
                className="w-full px-4 py-3 bg-inputBg rounded-lg outline-none text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 transition pr-12"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
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
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              type="submit"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
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
