import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import prismadb from "@/app/lib/prismadb";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json([], { status: 401 });
  }

  const users = await prismadb.user.findMany({
    select: {
      email: true,
      id: true,
      name: true,
      profileImage: true,
    },
    where: {
      NOT: {
        email: session.user.email,
      },
    },
  });

  return NextResponse.json(users);
}
