// app/api/admin/flights/[id]/bookings/stats/route.ts
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

    const bookings = await prisma.flightBooking.findMany({
      where: { flightId },
    });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (s, b) => s + (b.status === "cancelled" ? 0 : b.totalPrice),
      0
    );
    const seatsSold = bookings.reduce(
      (s, b) => s + (b.status === "cancelled" ? 0 : b.passengers),
      0
    );

    const flight = await prisma.flight.findUnique({ where: { id: flightId } });

    return NextResponse.json({
      success: true,
      flightId,
      totalBookings,
      totalRevenue,
      seatsSold,
      availableSeats: flight?.availableSeats ?? null,
      bookingsByStatus: bookings.reduce((acc: any, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
