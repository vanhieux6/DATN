import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { subtitle: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ];
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          destination: {
            select: {
              city: true,
              province: true,
            },
          },
          highlights: true,
          included: true,
          availableDates: true,
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      "title",
      "category",
      "location",
      "duration",
      "price",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    const activity = await prisma.activity.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || "",
        image:
          body.image ||
          "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=600&fit=crop",
        category: body.category,
        location: body.location,
        duration: body.duration,
        groupSize: body.groupSize || "1-10 người",
        price: parseFloat(body.price),
        originalPrice: parseFloat(body.originalPrice) || parseFloat(body.price),
        discount: body.discount || "0%",
        difficulty: body.difficulty || "Dễ",
        ageRequirement: body.ageRequirement || "Trên 6 tuổi",
        schedule: body.schedule || "",
        bestTime: body.bestTime || "",
        destinationId: body.destinationId || null,
        rating: 0,
        reviewCount: 0,
      },
      include: {
        destination: {
          select: {
            city: true,
            province: true,
          },
        },
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
