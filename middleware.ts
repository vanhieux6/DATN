// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware: Checking path ${pathname}`);

  // 🔧 PUBLIC ROUTES - Không cần kiểm tra auth
  const publicRoutes = [
    "/",
    "/auth/admin-login",
    "/auth/login", 
    "/auth/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/auth/verify",
    "/api/admin/auth",
    "/hotels",
    "/flights", 
    "/packages",
    "/activities",
    "/insurance",
    "/support"
  ];

  // Kiểm tra nếu route là public
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    console.log(`Public route: ${pathname}, skipping auth check`);
    return NextResponse.next();
  }

  // 🛡️ ADMIN ROUTES PROTECTION - CHỈ KIỂM TRA TOKEN TỒN TẠI
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Cho phép truy cập admin login page và API auth
    if (pathname === "/auth/admin-login" || pathname === "/api/admin/auth") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;
    console.log("Admin route - Token found:", !!token);

    if (!token) {
      console.log("No admin token, redirecting to admin login");
      
      // For API routes, return JSON error
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { 
            error: "Unauthorized",
            message: "Vui lòng đăng nhập với tài khoản admin"
          }, 
          { status: 401 }
        );
      }
      
      // For page routes, redirect to login
      const redirectUrl = new URL("/auth/admin-login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      redirectUrl.searchParams.set("message", "unauthorized");
      
      return NextResponse.redirect(redirectUrl);
    }

    // ✅ CHỈ KIỂM TRA TOKEN TỒN TẠI, KHÔNG VERIFY
    // Verification sẽ được xử lý trong AdminLayout component
    console.log("Admin token exists, allowing access");
    
    // Thêm user info headers cho API routes (nếu cần)
    if (pathname.startsWith("/api/admin")) {
      // Có thể decode token đơn giản nếu cần thông tin user
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
        
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-email", decoded.email || "");
        requestHeaders.set("x-user-role", decoded.role || "");
        
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        // Nếu không decode được, vẫn cho phép truy cập
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  // 👤 USER ROUTES PROTECTION - Ngăn admin truy cập user features
  const userProtectedRoutes = [
    "/profile", "/booking", "/checkout", "/payment", 
    "/orders", "/cart", "/api/user"
  ];

  if (userProtectedRoutes.some(route => pathname.startsWith(route))) {
    console.log("User protected route:", pathname);
    
    // 🚨 Kiểm tra nếu admin đang cố truy cập user routes
    const adminToken = request.cookies.get("admin_token")?.value;
    if (adminToken) {
      console.log("Admin trying to access user route:", pathname);
      
      if (pathname.startsWith("/api/user")) {
        return NextResponse.json(
          { 
            error: "Forbidden",
            message: "Tài khoản admin không thể sử dụng tính năng người dùng"
          }, 
          { status: 403 }
        );
      }
      
      // Redirect admin về trang quản trị
      const redirectUrl = new URL("/admin", request.url);
      redirectUrl.searchParams.set("message", "admin_cannot_use_user_features");
      return NextResponse.redirect(redirectUrl);
    }

    // Kiểm tra user token
    const userToken = request.cookies.get("token")?.value;
    
    if (!userToken) {
      console.log("No user token for protected route");
      
      if (pathname.startsWith("/api/user")) {
        return NextResponse.json(
          { 
            error: "Unauthorized",
            message: "Vui lòng đăng nhập"
          }, 
          { status: 401 }
        );
      }
      
      const redirectUrl = new URL("/auth/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // ✅ User token tồn tại, cho phép truy cập
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*", 
    "/profile/:path*",
    "/booking/:path*",
    "/checkout/:path*", 
    "/payment/:path*",
    "/orders/:path*",
    "/cart/:path*",
    "/api/user/:path*"
  ],
};