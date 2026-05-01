import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prismadb from "@/app/lib/prismadb";

export async function POST(req: Request) {
  let senderId: string | undefined;

  try {
    // Lấy session để xác thực người dùng
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Chưa được xác thực" },
        { status: 401 },
      );
    }

    senderId = session.user.id;

    // Parse body từ request
    const body = await req.json();
    const { message, receiverId } = body;

    // Validate dữ liệu đầu vào
    if (!message || !receiverId) {
      return NextResponse.json(
        { error: "Thiếu các trường bắt buộc: message và receiverId" },
        { status: 400 },
      );
    }

    // Kiểm tra message không được rỗng
    if (!message.trim()) {
      return NextResponse.json(
        { error: "Tin nhắn không được để trống" },
        { status: 400 },
      );
    }

    // Tạo message mới trong database
    const newMessage = await prismadb.message.create({
      data: {
        body: message.trim(),
        receiverId,
        senderId,
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    // Trả về message vừa tạo với status 201 (Created)
    return NextResponse.json(newMessage, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
