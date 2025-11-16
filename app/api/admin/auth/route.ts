// app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

// Đăng nhập admin: CHỈ cho phép role = admin
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Tìm user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }

    // 🚨 QUAN TRỌNG: Chỉ cho phép admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { 
          error: "Tài khoản không có quyền truy cập trang quản trị",
          redirectTo: "/auth/login"
        }, 
        { status: 403 }
      );
    }

    // Kiểm tra password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }

    // Tạo token admin
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" } // Tăng thời gian cho admin
    );

    // Lưu cookie admin_token
    const res = NextResponse.json({ 
      message: "Đăng nhập admin thành công", 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      redirectTo: "/admin"
    });
    
    res.cookies.set("admin_token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/" 
    });

    // 🚨 Xóa token user nếu có
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/"
    });

    return res;

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// Verify admin token
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // 🚨 QUAN TRỌNG: Verify role admin
    if (decoded.role !== "admin") {
      const response = NextResponse.json({ isLoggedIn: false }, { status: 200 });
      response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
      return response;
    }

    return NextResponse.json({
      isLoggedIn: true,
      user: decoded,
    });
  } catch (err) {
    const response = NextResponse.json({ isLoggedIn: false }, { status: 200 });
    response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return response;
  }
}