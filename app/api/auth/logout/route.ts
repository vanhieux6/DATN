// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Tạo response thành công
    const response = NextResponse.json(
      { 
        success: true,
        message: "Đăng xuất thành công" 
      },
      { status: 200 }
    );

    // Xóa tất cả các cookie liên quan đến auth
    const cookiesToClear = [
      'token',
      'admin_token',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url'
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0, // Expire immediately
        path: "/",
      });
    });

    // Thêm headers để ngăn cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    console.log("Logout API: Đã xóa cookies auth");
    return response;

  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Đăng xuất thất bại" 
      },
      { status: 500 }
    );
  }
}

// Cũng có thể hỗ trợ method GET cho logout
export async function GET() {
  return POST();
}