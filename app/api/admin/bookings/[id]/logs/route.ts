// ✅ api/admin/bookings/[id]/logs/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const logs = await prisma.bookingLog.findMany({
    where: { bookingId: id },
    orderBy: { createdAt: "asc" }, // hiển thị timeline theo thứ tự thời gian
  });

  return NextResponse.json({ logs });
}
