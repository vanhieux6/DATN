// app/api/bookings/flights/[bookingCode]/route.ts
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

    const booking = await prisma.flightBooking.findUnique({
      where: {
        bookingCode,
        userId: user.id, // Ensure user can only access their own bookings
      },
      include: {
        flight: {
          select: {
            id: true,
            airline: true,
            flightNumber: true,
            departure: true,
            arrival: true,
            departureDate: true,
            departureTime: true,
            arrivalTime: true,
            duration: true,
            aircraft: true,
            class: true,
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

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        passengers: booking.passengers,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
        flight: booking.flight,
        user: booking.user,
      },
    });
  } catch (error) {
    console.error("Error fetching flight booking:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
