import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prismadb from "@/app/lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Định dạng email không hợp lệ" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 },
      );
    }

    const existingUser = await prismadb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email đã tồn tại" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        bio: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        profileImage: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });
  } catch (error) {
    console.error("[SIGN_UP_ERROR]", error);

    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
