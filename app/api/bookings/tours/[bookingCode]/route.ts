// app/api/bookings/tours/[bookingCode]/route.ts
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingCode: string }> }
) {
  try {
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookingCode } = await params;

    const booking = await prisma.packageBooking.findUnique({
      where: {
        bookingCode,
        userId: user.id,
      },
      include: {
        package: {
          include: {
            destination: {
              select: {
                city: true,
                country: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    const safeBooking = {
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
      contactInfo: booking.contactInfo ? JSON.parse(booking.contactInfo) : null,
      package: booking.package,
      user: booking.user,
    };

    return NextResponse.json({
      success: true,
      booking: safeBooking,
    });
  } catch (error) {
    console.error("Error fetching tour booking:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
