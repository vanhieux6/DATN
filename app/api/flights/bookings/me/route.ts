// Travel_Website/app/api/flights/bookings/me/route.ts
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
    if (!user)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const bookings = await prisma.flightBooking.findMany({
      where: { userId: user.id },
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
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
