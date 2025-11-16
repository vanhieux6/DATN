// app/api/tours/bookings/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function verifyUser(request: Request) {
  const token = (request as any).cookies?.get?.("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.packageBooking.findMany({
      where: { userId: user.id },
      include: {
        package: {
          select: {
            id: true,
            title: true,
            destination: {
              select: {
                city: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform data for safe serialization
    const safeBookings = bookings.map((booking) => ({
      id: booking.id,
      bookingCode: booking.bookingCode,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
      selectedDate: booking.selectedDate,
      specialRequests: booking.specialRequests
        ? JSON.parse(booking.specialRequests)
        : null,
      package: booking.package,
    }));

    return NextResponse.json({
      success: true,
      bookings: safeBookings,
    });
  } catch (error) {
    console.error("Error fetching user tour bookings:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
