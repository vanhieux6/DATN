import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// GET - Lấy danh sách flights
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const airline = searchParams.get("airline") || "";

    const skip = (page - 1) * limit;

    // Xây dựng where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { airline: { contains: search, mode: "insensitive" } },
        { flightNumber: { contains: search, mode: "insensitive" } },
        { departure: { contains: search, mode: "insensitive" } },
        { arrival: { contains: search, mode: "insensitive" } },
      ];
    }

    if (airline) {
      where.airline = airline;
    }

    // Lấy flights với pagination
    const [flights, total] = await Promise.all([
      prisma.flight.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          features: true,
        },
      }),
      prisma.flight.count({ where }),
    ]);

    return NextResponse.json({
      flights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get flights error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Thêm chuyến bay mới
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

    // Tạo chuyến bay với transaction
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
