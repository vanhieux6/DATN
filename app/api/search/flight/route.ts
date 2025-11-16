import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departure = searchParams.get('departure');
    const arrival = searchParams.get('arrival');
    const date = searchParams.get('date');

    const where: any = {};

    if (departure) {
      where.departure = { contains: departure, mode: 'insensitive' };
    }
    if (arrival) {
      where.arrival = { contains: arrival, mode: 'insensitive' };
    }
    if (date) {
      where.departureDate = date;
    }

    const flights = await prisma.flight.findMany({
      where,
      take: 20,
      orderBy: { price: 'asc' }
    });

    const data = flights.map(flight => ({
      id: flight.id,
      type: 'flight' as const,
      title: `${flight.departure} → ${flight.arrival}`,
      subtitle: `${flight.airline} • ${flight.flightNumber}`,
      image: '/images/flight-default.jpg', // Add default flight image
      price: flight.price,
      duration: flight.duration,
      departure: flight.departure,
      arrival: flight.arrival,
      departureTime: flight.departureTime,
    }));

    return NextResponse.json({
      success: true,
      data,
      total: flights.length
    });
  } catch (error) {
    console.error('Flight search error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search flights' },
      { status: 500 }
    );
  }
}