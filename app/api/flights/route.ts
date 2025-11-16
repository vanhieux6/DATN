// app/api/flights/route.tsx
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const departureDate = searchParams.get("departureDate");
    const returnDate = searchParams.get("returnDate");
    const passengers = searchParams.get("passengers");
    const classType = searchParams.get("class");
    const airline = searchParams.get("airline");
    const maxPrice = searchParams.get("maxPrice");
    const stops = searchParams.get("stops");

    // Build where clause for filtering
    const where: any = {};

    if (from && from !== "all") {
      where.departure = {
        contains: from,
        mode: "insensitive",
      };
    }

    if (to && to !== "all") {
      where.arrival = {
        contains: to,
        mode: "insensitive",
      };
    }

    if (departureDate && departureDate !== "all") {
      where.departureDate = departureDate;
    }

    if (classType && classType !== "all") {
      where.class = {
        contains: classType,
        mode: "insensitive",
      };
    }

    if (airline && airline !== "all") {
      where.airline = {
        contains: airline,
        mode: "insensitive",
      };
    }

    if (maxPrice && maxPrice !== "all") {
      where.price = {
        lte: parseInt(maxPrice),
      };
    }

    if (stops && stops !== "all") {
      where.stops = stops;
    }

    // Fetch flights with features
    const flights = await prisma.flight.findMany({
      where,
      include: {
        features: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    // Transform data to match frontend expectations
    const transformedFlights = flights.map((flight: any) => ({
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departure: flight.departure,
      arrival: flight.arrival,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: flight.duration,
      price: flight.price,
      originalPrice: flight.originalPrice,
      discount: flight.discount,
      stops: flight.stops,
      aircraft: flight.aircraft,
      class: flight.class,
      availableSeats: flight.availableSeats,
      departureDate: flight.departureDate,
      returnDate: flight.returnDate,
      features: flight.features.map((f: any) => f.name),
      airlineLogo: `/airlines/${flight.airline
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`,
    }));

    return NextResponse.json({
      success: true,
      data: transformedFlights,
      total: transformedFlights.length,
      filters: {
        from,
        to,
        departureDate,
        returnDate,
        passengers,
        class: classType,
        airline,
        maxPrice,
        stops,
      },
    });
  } catch (error) {
    console.error("Error fetching flights:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Không thể lấy dữ liệu chuyến bay",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: any) {
  try {
    const body = await request.json();
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Không tìm thấy token. Bạn cần đăng nhập lại.",
        },
        { status: 401 }
      );
    }
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // ✅ Log đầy đủ để debug
    console.log("=== BOOKING REQUEST ===");
    console.log("Raw body:", JSON.stringify(body, null, 2));
    console.log("Body types:", {
      flightId: typeof body.flightId,
      userId: decoded.id,
      passengers: typeof body.passengers,
      totalPrice: typeof body.totalPrice,
    });

    // ✅ Kiểm tra từng trường một
    const errors = [];
    if (!body.flightId) errors.push("flightId is missing");
    if (!decoded.id) errors.push("userId is missing");
    if (!body.passengers) errors.push("passengers is missing");
    if (!body.totalPrice) errors.push("totalPrice is missing");

    if (errors.length > 0) {
      console.error("Validation errors:", errors);
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Thiếu thông tin bắt buộc: " + errors.join(", "),
          details: errors,
        },
        { status: 400 }
      );
    }

    // Chuyển đổi kiểu dữ liệu
    const flightId = parseInt(body.flightId);
    const passengers = parseInt(body.passengers);
    const totalPrice = parseInt(body.totalPrice);

    // Kiểm tra kiểu dữ liệu
    if (isNaN(flightId) || isNaN(passengers) || isNaN(totalPrice)) {
      console.error("Invalid data types after parsing:", {
        flightId: isNaN(flightId) ? "NaN" : flightId,
        passengers: isNaN(passengers) ? "NaN" : passengers,
        totalPrice: isNaN(totalPrice) ? "NaN" : totalPrice,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid data types",
          message:
            "Dữ liệu không hợp lệ: flightId, passengers, totalPrice phải là số",
        },
        { status: 400 }
      );
    }

    console.log("=== VALIDATED DATA ===");
    console.log({
      flightId,
      userId: decoded.id,
      passengers,
      totalPrice,
    });

    // ✅ Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          message: "Người dùng không tồn tại",
        },
        { status: 404 }
      );
    }

    // Check if flight exists and has enough seats
    const flight = await prisma.flight.findUnique({
      where: { id: flightId },
    });

    if (!flight) {
      return NextResponse.json(
        {
          success: false,
          error: "Flight not found",
          message: "Chuyến bay không tồn tại",
        },
        { status: 404 }
      );
    }

    if (flight.availableSeats < passengers) {
      return NextResponse.json(
        {
          success: false,
          error: "Not enough seats",
          message: `Không đủ chỗ trống. Chỉ còn ${flight.availableSeats} chỗ`,
        },
        { status: 400 }
      );
    }

    // Generate booking code
    const bookingCode = `FL${Date.now().toString().slice(-6)}`;

    // ✅ Sử dụng transaction để đảm bảo data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create new flight booking
      const newBooking = await tx.flightBooking.create({
        data: {
          flightId: flightId,
          userId: decoded.id,
          passengers: passengers,
          totalPrice: totalPrice,
          status: "confirmed",
          bookingCode: bookingCode,
        },
        include: {
          flight: {
            select: {
              airline: true,
              flightNumber: true,
              departure: true,
              arrival: true,
              departureTime: true,
              arrivalTime: true,
              departureDate: true,
              class: true,
            },
          },
        },
      });

      // Update available seats
      await tx.flight.update({
        where: { id: flightId },
        data: {
          availableSeats: {
            decrement: passengers,
          },
        },
      });

      return newBooking;
    });

    console.log("Booking created successfully:", result.id);

    return NextResponse.json(
      {
        success: true,
        message: "Đặt vé thành công",
        data: {
          id: result.id,
          bookingCode: result.bookingCode,
          flightId: result.flightId,
          airline: result.flight.airline,
          flightNumber: result.flight.flightNumber,
          departure: result.flight.departure,
          arrival: result.flight.arrival,
          departureTime: result.flight.departureTime,
          arrivalTime: result.flight.arrivalTime,
          departureDate: result.flight.departureDate,
          class: result.flight.class,
          passengers: result.passengers,
          totalPrice: result.totalPrice,
          status: result.status,
          createdAt: result.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== BOOKING ERROR ===");
    console.error("Error:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          "Lỗi hệ thống khi đặt vé: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
