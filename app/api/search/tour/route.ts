import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const guests = searchParams.get('guests');

    const where: any = {};

    if (destination) {
      where.OR = [
        { title: { contains: destination, mode: 'insensitive' } },
        { 
          destination: {
            city: { contains: destination, mode: 'insensitive' }
          }
        }
      ];
    }

    const tours = await prisma.tourPackage.findMany({
      where,
      take: 20,
      include: {
        destination: {
          select: {
            city: true,
            country: true
          }
        }
      },
      orderBy: { rating: 'desc' }
    });

    const data = tours.map(tour => ({
      id: tour.id,
      type: 'tour' as const,
      title: tour.title,
      subtitle: tour.subtitle,
      image: tour.image,
      price: tour.price,
      rating: tour.rating,
      duration: tour.duration,
      location: tour.destination?.city,
    }));

    return NextResponse.json({
      success: true,
      data,
      total: tours.length
    });
  } catch (error) {
    console.error('Tour search error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search tours' },
      { status: 500 }
    );
  }
}