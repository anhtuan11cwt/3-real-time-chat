import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prismadb from "@/app/lib/prismadb";

/**
 * API lấy thông tin user hiện tại
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      select: {
        bio: true,
        email: true,
        hasProfile: true,
        id: true,
        name: true,
        profileImage: true,
      },
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Người dùng không tồn tại" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
