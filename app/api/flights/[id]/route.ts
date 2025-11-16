// app/api/admin/flights/[id]/route.ts
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Hàm helper để verify admin
async function verifyAdmin(request: any) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "admin") {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// GET - Lấy chi tiết chuyến bay
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const flight = await prisma.flight.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        features: true,
      },
    });

    if (!flight) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy chuyến bay" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      flight,
    });
  } catch (error) {
    console.error("Error fetching flight:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
