// Travel_Website/app/api/admin/flights/cancel/[id]/route.ts
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Sửa từ bookingId thành id
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    // Sửa cách lấy params
    const { id: bookingId } = await params; // Đổi từ bookingId thành id

    console.log("Cancelling booking ID:", bookingId); // Debug

    if (!bookingId) {
      return NextResponse.json(
        { success: false, message: "Booking ID is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.flightBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking)
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { success: false, message: "Booking already cancelled" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.flightBooking.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
      });

      // Tăng lại available seats
      await tx.flight.update({
        where: { id: booking.flightId },
        data: {
          availableSeats: { increment: booking.passengers },
        },
      });

      return updated;
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: result,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
