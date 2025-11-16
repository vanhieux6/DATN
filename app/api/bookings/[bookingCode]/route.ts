// app/api/bookings/[bookingCode]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingCode: string }> }
) {
  try {
    const { bookingCode } = await params;

    const booking = await prisma.packageBooking.findUnique({
      where: { bookingCode },
      include: {
        package: {
          include: {
            destination: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Tạo response object với kiểu an toàn
    const responseBooking: any = {
      id: booking.id,
      bookingCode: booking.bookingCode,
      package: booking.package.title,
      destination: booking.package.destination?.city,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt,
    };

    // Chỉ thêm các trường optional nếu tồn tại
    if (booking.selectedDate) {
      responseBooking.selectedDate = booking.selectedDate;
    }

    if (booking.specialRequests) {
      responseBooking.specialRequests = JSON.parse(booking.specialRequests);
    }

    if (booking.contactInfo) {
      responseBooking.contactInfo = JSON.parse(booking.contactInfo);
    }

    return NextResponse.json({
      booking: responseBooking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
