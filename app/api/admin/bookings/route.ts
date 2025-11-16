// app/api/admin/bookings/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const pageSize = Math.max(
    10,
    parseInt(url.searchParams.get("pageSize") || "20")
  );

  const where: any = {};

  if (q) {
    where.OR = [
      { bookingCode: { contains: q, mode: "insensitive" } },
      // Nếu cần tìm thêm theo tên package:
      // { package: { title: { contains: q, mode: "insensitive" } } },
    ];
  }

  // ✅ Chỉ lọc nếu status khác "all"
  if (status && status !== "all") {
    where.status = status;
  }

  const total = await prisma.packageBooking.count({ where });
  const bookings = await prisma.packageBooking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      user: { select: { id: true, name: true, email: true } },
      package: { select: { id: true, title: true } },
    },
  });

  return NextResponse.json({
    data: bookings,
    meta: { total, page, pageSize },
  });
}
