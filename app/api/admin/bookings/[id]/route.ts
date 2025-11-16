// app/api/admin/bookings/[id]/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const booking = await prisma.packageBooking.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      package: { select: { id: true, title: true } },
    },
  });

  return Response.json({ booking });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const { status, adminUserId, bookingCode, note, previousStatus } = body;

  const booking = await prisma.packageBooking.findUnique({ where: { id } });
  if (!booking) {
    return new NextResponse("Booking not found", { status: 404 });
  }

  // ✅ Cập nhật trạng thái booking
  const updated = await prisma.packageBooking.update({
    where: { id },
    data: { status },
  });

  // ✅ Sinh log tự động
  let action = "updated";
  let message = `Trạng thái thay đổi từ "${previousStatus}" sang "${status}".`;

  switch (status) {
    case "confirmed":
      action = "confirmed";
      message = "Admin đã xác nhận đơn đặt tour.";
      break;
    case "completed":
      action = "completed";
      message = "Tour đã hoàn thành.";
      break;
    case "cancelled":
      action = "cancelled";
      message = "Booking đã bị huỷ.";
      break;
    case "refunded":
      action = "refunded";
      message = "Khách hàng đã được hoàn tiền.";
      break;
    default:
      break;
  }

  await prisma.bookingLog.create({
    data: {
      bookingId: id,
      bookingCode,
      action,
      message,
      userId: adminUserId,
    },
  });

  return NextResponse.json({ updated });
}
