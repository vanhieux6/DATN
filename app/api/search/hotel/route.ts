import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const checkIn = searchParams.get('checkIn');
    const guests = searchParams.get('guests');

    const where: any = {};

    if (destination) {
      where.OR = [
        { location: { contains: destination, mode: 'insensitive' } },
        { name: { contains: destination, mode: 'insensitive' } }
      ];
    }

    const hotels = await prisma.hotel.findMany({
      where,
      take: 20,
      select: {
        id: true,
        name: true,
        image: true,
        location: true,
        price: true,
        rating: true,
        description: true,
      },
      orderBy: { rating: 'desc' }
    });

    const data = hotels.map(hotel => ({
      id: hotel.id,
      type: 'hotel' as const,
      title: hotel.name,
      subtitle: hotel.description,
      image: hotel.image,
      price: hotel.price,
      rating: hotel.rating,
      location: hotel.location,
    }));

    return NextResponse.json({
      success: true,
      data,
      total: hotels.length
    });
  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search hotels' },
      { status: 500 }
    );
  }
}