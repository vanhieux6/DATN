// app/api/admin/flights/[id]/bookings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function verifyAdmin(request: Request) {
  const token = (request as any).cookies?.get?.("admin_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== "admin") return null;
    return user;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await context.params;
    const flightId = Number(id);
    if (isNaN(flightId))
      return NextResponse.json(
        { success: false, message: "Invalid flight id" },
        { status: 400 }
      );

    const flight = await prisma.flight.findUnique({ where: { id: flightId } });
    if (!flight)
      return NextResponse.json(
        { success: false, message: "Flight not found" },
        { status: 404 }
      );

    const bookings = await prisma.flightBooking.findMany({
      where: { flightId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      flightId,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching flight bookings:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
