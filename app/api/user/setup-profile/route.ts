import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prismadb from "@/app/lib/prismadb";

/**
 * API cập nhật profile người dùng
 * Nhận name, bio, profileImage từ request body
 * Xác thực user qua session, cập nhật vào MongoDB
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    // Kiểm tra đăng nhập
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { bio, profileImage } = await req.json();

    // Cập nhật user vào database (name đã có từ sign-up)
    const user = await prismadb.user.update({
      data: {
        bio,
        hasProfile: true,
        profileImage,
      },
      where: {
        email: session.user.email,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
