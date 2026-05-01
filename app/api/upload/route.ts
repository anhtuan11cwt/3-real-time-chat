import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

/**
 * API upload ảnh lên Cloudinary
 * Nhận file từ FormData, convert sang base64, upload lên Cloudinary
 * Trả về secure_url của ảnh đã upload
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // Kiểm tra có file được upload không
    if (!file) {
      return NextResponse.json(
        { error: "Không có file được upload" },
        { status: 400 },
      );
    }

    // Chỉ cho phép file ảnh
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Chỉ cho phép file ảnh" },
        { status: 400 },
      );
    }

    // Giới hạn kích thước file 2MB
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Kích thước file tối đa 2MB" },
        { status: 400 },
      );
    }

    // Convert file sang base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload lên Cloudinary
    const uploadRes = await cloudinary.uploader.upload(base64String, {
      folder: "chat-app/avatars",
    });

    // Trả về secure_url
    return NextResponse.json({
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);

    return NextResponse.json({ error: "Upload thất bại" }, { status: 500 });
  }
}
