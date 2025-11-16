// app/api/bookings/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const token =
      request.cookies.get("token")?.value ||
      request.cookies.get("admin_token")?.value;

    // Check authentication
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const {
      packageId,
      participants,
      selectedDate,
      specialRequests,
      contactInfo,
    } = body;

    // Validation
    if (!packageId || !participants || !selectedDate) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: packageId, participants, selectedDate",
        },
        { status: 400 }
      );
    }

    if (participants < 1 || participants > 20) {
      return NextResponse.json(
        { error: "Number of participants must be between 1 and 20" },
        { status: 400 }
      );
    }

    // Check if selected date is valid
    const tourDate = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (tourDate < today) {
      return NextResponse.json(
        { error: "Selected date cannot be in the past" },
        { status: 400 }
      );
    }

    // Get user from token
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get tour package with availability check
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: parseInt(packageId) },
      include: {
        bookings: {
          where: {
            selectedDate: selectedDate,
            status: { in: ["confirmed", "pending"] },
          },
        },
      },
    });

    if (!tourPackage) {
      return NextResponse.json(
        { error: "Tour package not found" },
        { status: 404 }
      );
    }

    // Check if package is still valid
    if (tourPackage.validUntil) {
      const validUntil = new Date(tourPackage.validUntil);
      if (validUntil < today) {
        return NextResponse.json(
          { error: "This tour package has expired" },
          { status: 400 }
        );
      }
    }

    // Check group size limits
    const groupSize = parseInt(tourPackage.groupSize) || 20;
    const currentBookingsCount = tourPackage.bookings.reduce(
      (sum, booking) => sum + booking.participants,
      0
    );

    if (currentBookingsCount + participants > groupSize) {
      const availableSpots = groupSize - currentBookingsCount;
      return NextResponse.json(
        {
          error: "Not enough available spots",
          availableSpots,
          message: `Only ${availableSpots} spots available`,
        },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = tourPackage.price * participants;

    // Generate unique booking code
    const generateBookingCode = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      return `TP${timestamp}${random}`.toUpperCase();
    };

    // Create booking data với kiểu an toàn
    const bookingData: any = {
      packageId: parseInt(packageId),
      userId: user.id,
      participants: parseInt(participants),
      totalPrice,
      status: "confirmed",
      bookingCode: generateBookingCode(),
      selectedDate: selectedDate,
    };

    // Chỉ thêm các trường optional nếu có giá trị
    if (specialRequests) {
      bookingData.specialRequests = JSON.stringify(specialRequests);
    }

    if (contactInfo) {
      bookingData.contactInfo = JSON.stringify(contactInfo);
    }

    // Create booking
    const booking = await prisma.packageBooking.create({
      data: bookingData,
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

    // Parse lại các trường JSON để response
    const responseBooking = {
      id: booking.id,
      bookingCode: booking.bookingCode,
      package: booking.package.title,
      destination: booking.package.destination?.city,
      participants: booking.participants,
      totalPrice: booking.totalPrice,
      status: booking.status,
      selectedDate: booking.selectedDate,
      specialRequests: booking.specialRequests
        ? JSON.parse(booking.specialRequests)
        : null,
      contactInfo: booking.contactInfo ? JSON.parse(booking.contactInfo) : null,
      createdAt: booking.createdAt,
    };

    return NextResponse.json({
      success: true,
      booking: responseBooking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
