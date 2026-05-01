import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prismadb from "@/app/lib/prismadb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  let currentUserId: string | undefined;
  let userId: string | undefined;

  try {
    // Lấy session để xác thực người dùng
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Chưa được xác thực" },
        { status: 401 },
      );
    }

    currentUserId = session.user.id;
    const resolvedParams = await params;
    userId = resolvedParams.userId;

    // Lấy messages giữa 2 user
    const messages = await prismadb.message.findMany({
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
      orderBy: {
        createdAt: "asc",
      },
      where: {
        OR: [
          {
            receiverId: userId,
            senderId: currentUserId,
          },
          {
            receiverId: currentUserId,
            senderId: userId,
          },
        ],
      },
    });

    // Trả response
    return NextResponse.json(messages, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
