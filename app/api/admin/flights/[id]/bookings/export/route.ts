// app/api/admin/flights/[id]/bookings/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
async function verifyAdmin(request: Request) {
  const token = (request as any).cookies?.get?.("admin_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.role !== "admin") return null;
    return user;
  } catch {
    return null;
  }
}

function toCsvRow(values: (string | number | null | undefined)[]) {
  return values
    .map((v) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      // escape quotes
      return `"${s.replace(/"/g, '""')}"`;
    })
    .join(",");
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = await context.params;
    const flightId = Number(id);

    const bookings = await prisma.flightBooking.findMany({
      where: { flightId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Booking ID",
      "Booking Code",
      "User ID",
      "User Name",
      "User Email",
      "Passengers",
      "Total Price",
      "Status",
      "Created At",
      "Flight ID",
    ];

    const rows = bookings.map((b) =>
      toCsvRow([
        b.id,
        b.bookingCode,
        b.userId,
        b.user?.name ?? "",
        b.user?.email ?? "",
        b.passengers,
        b.totalPrice,
        b.status,
        b.createdAt.toISOString(),
        b.flightId,
      ])
    );

    const csv = [toCsvRow(headers), ...rows].join("\n");

    const filename = `flight-${flightId}-bookings-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting bookings:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi hệ thống" },
      { status: 500 }
    );
  }
}
