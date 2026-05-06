import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html className={`${inter.variable} h-full antialiased`} lang="en">
      <body className="flex flex-col bg-slate-950 min-h-full text-white antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
