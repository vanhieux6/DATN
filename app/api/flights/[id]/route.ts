// app/api/flights/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const flightId = parseInt(id);

    if (isNaN(flightId)) {
      return NextResponse.json(
        { success: false, message: "Invalid flight ID" },
        { status: 400 }
      );
    }

    const flight = await prisma.flight.findUnique({
      where: { id: flightId },
      include: { features: true },
    });

    if (!flight) {
      return NextResponse.json(
        { success: false, message: "Flight not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, flight });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}