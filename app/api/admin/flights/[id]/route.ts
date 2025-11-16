// File: app/api/admin/flight/[id]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// ==========================
// Helper verify admin
// ==========================
export async function verifyAdmin(request: any) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.role !== "admin") return null;
    return user;
  } catch {
    return null;
  }
}

// ==========================
// Helper parse ID
// ==========================
async function getId(params: Promise<{ id: string }>) {
  const realParams = await params;
  const id = parseInt(realParams.id);
  if (isNaN(id)) throw new Error("Invalid ID");
  return id;
}

// ==========================
// Helper find flight + features
// ==========================
async function findFlight(id: number) {
  const flight = await prisma.flight.findUnique({
    where: { id },
    include: {
      _count: { select: { bookings: true } },
      features: true,
    },
  });

  return flight;
}

// ==========================
// GET — Lấy flight theo ID
// ==========================
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params);
    const flight = await findFlight(id);

    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...flight,
      features: flight.features?.map((f) => f.name) || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes("Invalid") ? 400 : 404 }
    );
  }
}

// ==========================
// PUT — Update flight
// ==========================
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const flightId = Number(id);
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("=== UPDATE FLIGHT REQUEST ===", body);

    const existingFlight = await prisma.flight.findUnique({
      where: { id: flightId },
    });

    if (!existingFlight) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy chuyến bay" },
        { status: 404 }
      );
    }

    // Tính discount
    const discount =
      body.originalPrice && body.price
        ? Math.round(
            ((body.originalPrice - body.price) / body.originalPrice) * 100
          )
        : existingFlight.discount;

    // Transaction update
    const flight = await prisma.$transaction(async (tx) => {
      const updatedFlight = await tx.flight.update({
        where: { id: flightId },
        data: {
          airline: body.airline ?? existingFlight.airline,
          flightNumber: body.flightNumber ?? existingFlight.flightNumber,
          departure: body.departure ?? existingFlight.departure,
          arrival: body.arrival ?? existingFlight.arrival,
          departureTime: body.departureTime ?? existingFlight.departureTime,
          arrivalTime: body.arrivalTime ?? existingFlight.arrivalTime,
          duration: body.duration ?? existingFlight.duration,
          price: body.price ? parseInt(body.price) : existingFlight.price,
          originalPrice: body.originalPrice
            ? parseInt(body.originalPrice)
            : existingFlight.originalPrice,
          discount: discount.toString(),
          stops: body.stops ?? existingFlight.stops,
          aircraft: body.aircraft ?? existingFlight.aircraft,
          class: body.class ?? existingFlight.class,
          availableSeats: body.availableSeats
            ? parseInt(body.availableSeats)
            : existingFlight.availableSeats,
          departureDate: body.departureDate ?? existingFlight.departureDate,
          returnDate:
            body.returnDate !== undefined
              ? body.returnDate
              : existingFlight.returnDate,
        },
      });

      // Update features
      if (Array.isArray(body.features)) {
        await tx.flightFeature.deleteMany({
          where: { flightId },
        });

        if (body.features.length > 0) {
          await tx.flightFeature.createMany({
            data: body.features.map((feature: string) => ({
              flightId,
              name: feature,
            })),
          });
        }
      }

      return updatedFlight;
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật chuyến bay thành công",
      flight,
    });
  } catch (error) {
    console.error("Error updating flight:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi cập nhật chuyến bay" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE — Xóa flight
// ==========================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const flightId = parseInt(params.id);

    const bookings = await prisma.flightBooking.findMany({
      where: { flightId },
    });

    if (bookings.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Không thể xóa chuyến bay đã có booking. Vui lòng hủy các booking trước.",
        },
        { status: 400 }
      );
    }

    await prisma.flightFeature.deleteMany({
      where: { flightId },
    });

    await prisma.flight.delete({
      where: { id: flightId },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa chuyến bay thành công",
    });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống khi xóa chuyến bay" },
      { status: 500 }
    );
  }
}
