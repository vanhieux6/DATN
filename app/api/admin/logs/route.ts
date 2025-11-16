// app/api/admin/logs/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.max(
    20,
    parseInt(url.searchParams.get("pageSize") || "50")
  );

  const where: any = {};
  if (q) {
    where.OR = [
      { bookingCode: { contains: q, mode: "insensitive" } },
      { action: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
    ];
  }

  const total = await prisma.activityBooking.count({ where });
  const logs = await prisma.activityBooking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json({ logs, meta: { total, page, pageSize } });
}
