import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function POST(request: any) {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Kiểm tra role admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden - Admin only" },
        { status: 403 }
      );
    }

    const body = await request.json();

    console.log("=== CREATE FLIGHT REQUEST ===");
    console.log("Body:", body);

    // Validation
    const requiredFields = [
      "airline",
      "flightNumber",
      "departure",
      "arrival",
      "departureTime",
      "arrivalTime",
      "duration",
      "price",
      "originalPrice",
      "stops",
      "aircraft",
      "class",
      "availableSeats",
      "departureDate",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Tính discount
    const discount =
      body.originalPrice && body.price
        ? Math.round(
            ((body.originalPrice - body.price) / body.originalPrice) * 100
          )
        : "0";

    const flight = await prisma.$transaction(async (tx) => {
      // Tạo flight
      const newFlight = await tx.flight.create({
        data: {
          airline: body.airline,
          flightNumber: body.flightNumber,
          departure: body.departure,
          arrival: body.arrival,
          departureTime: body.departureTime,
          arrivalTime: body.arrivalTime,
          duration: body.duration,
          price: parseInt(body.price),
          originalPrice: parseInt(body.originalPrice),
          discount: discount.toString(),
          stops: body.stops,
          aircraft: body.aircraft,
          class: body.class,
          availableSeats: parseInt(body.availableSeats),
          departureDate: body.departureDate,
          returnDate: body.returnDate || null,
        },
      });

      // Tạo features nếu có
      if (
        body.features &&
        Array.isArray(body.features) &&
        body.features.length > 0
      ) {
        await tx.flightFeature.createMany({
          data: body.features.map((feature: string) => ({
            flightId: newFlight.id,
            name: feature,
          })),
        });
      }

      return newFlight;
    });

    console.log("✅ Flight created successfully:", flight.id);

    return NextResponse.json(
      {
        success: true,
        message: "Tạo chuyến bay thành công",
        flight,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== CREATE FLIGHT ERROR ===");
    console.error("Error:", error);

    if (error instanceof Error) {
      console.error("Message:", error.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi hệ thống khi tạo chuyến bay",
      },
      { status: 500 }
    );
  }
}
