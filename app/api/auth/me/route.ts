import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    // Check both tokens
    const token = request.cookies.get("token")?.value;
    const adminToken = request.cookies.get("admin_token")?.value;
    
    console.log("Auth me - tokens found:", { 
      hasToken: !!token, 
      hasAdminToken: !!adminToken 
    });

    const currentToken = adminToken || token;

    if (!currentToken) {
      return NextResponse.json({ 
        isLoggedIn: false,
        message: "No token found" 
      }, { status: 200 });
    }

    try {
      const decoded = jwt.verify(currentToken, JWT_SECRET) as any;
      console.log("Token decoded successfully for:", decoded.email);
      
      return NextResponse.json({
        isLoggedIn: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role
        }
      }, { status: 200 });

    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      
      // Clear invalid tokens
      const response = NextResponse.json({ 
        isLoggedIn: false,
        message: "Invalid token" 
      }, { status: 200 });
      
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      response.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
      
      return response;
    }

  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ 
      isLoggedIn: false,
      message: "Server error" 
    }, { status: 200 });
  }
}