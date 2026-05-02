import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Chưa được xác thực" },
        { status: 401 },
      );
    }

    const body = await req.formData();

    const socket_id = body.get("socket_id") as string;
    const channel_name = body.get("channel_name") as string;

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: "Thiếu socket_id hoặc channel_name" },
        { status: 400 },
      );
    }

    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      {
        user_id: session.user.id,
        user_info: {
          image: session.user.image,
          name: session.user.name,
        },
      },
    );

    return NextResponse.json(authResponse);
  } catch (error) {
    console.log("Lỗi xác thực Pusher:", error);
    return NextResponse.json({ error: "Lỗi máy chủ nội bộ" }, { status: 500 });
  }
}
