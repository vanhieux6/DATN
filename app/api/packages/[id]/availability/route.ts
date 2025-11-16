import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params trước khi sử dụng
    const { id } = await params;
    const packageId = parseInt(id);
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId },
      include: {
        bookings: {
          where: {
            selectedDate: date,
            status: { in: ['confirmed', 'pending'] }
          }
        }
      }
    });

    if (!tourPackage) {
      return NextResponse.json({ error: 'Tour package not found' }, { status: 404 });
    }

    const groupSize = parseInt(tourPackage.groupSize) || 20;
    const bookedSpots = tourPackage.bookings.reduce(
      (sum, booking) => sum + booking.participants, 
      0
    );
    const availableSpots = Math.max(0, groupSize - bookedSpots);

    return NextResponse.json({
      availableSpots,
      groupSize,
      bookedSpots,
      date
    });

  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}