// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { name, email, phone, password } = body;

    // 1️⃣ Kiểm tra user có tồn tại không
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // 2️⃣ Kiểm tra nếu email bị trùng với user khác
    if (email && email !== user.email) {
      const existedEmail = await prisma.user.findUnique({ where: { email } });
      if (existedEmail) {
        return NextResponse.json(
          { error: "Email đã được sử dụng" },
          { status: 409 }
        );
      }
    }

    // 3️⃣ Nếu có password mới thì hash lại
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 4️⃣ Cập nhật thông tin
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
        phone: phone ?? user.phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Cập nhật thông tin người dùng thành công",
      user: updated,
    });
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }
}
