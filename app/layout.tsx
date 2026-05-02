import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "Ứng dụng chat thời gian thực với Next.js, TypeScript và các công nghệ hiện đại",
  title: "Real-Time Chat - Ứng dụng trò chuyện thời gian thực",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      lang="en"
    >
      <body className="flex flex-col bg-slate-950 min-h-full text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
