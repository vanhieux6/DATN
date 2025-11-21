import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

interface RouteContext {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        highlights: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            rating: true,
          },
          orderBy: { rating: 'desc' }
        },
        activities_list: {
          select: {
            id: true,
            name: true,
            icon: true,
            description: true,
          },
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            hotels_relation: true,
            packages_relation: true,
            reviews: true
          }
        }
      }
    });

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          message: 'Destination not found'
        },
        { status: 404 }
      );
    }

    // Format the response
    const formattedDestination = {
      id: destination.id,
      city: destination.city,
      country: destination.country,
      province: destination.province,
      description: destination.description,
      image: destination.image,
      heroImage: destination.heroImage,
      rating: destination.rating,
      reviewCount: destination.reviewCount,
      hotels: destination._count.hotels_relation,
      fromPrice: destination.fromPrice,
      toPrice: destination.toPrice,
      bestTime: destination.bestTime,
      category: destination.category,
      popularity: destination.popularity,
      slug: destination.slug,
      temperature: destination.temperature,
      condition: destination.condition,
      humidity: destination.humidity,
      rainfall: destination.rainfall,
      flightTime: destination.flightTime,
      ferryTime: destination.ferryTime,
      carTime: destination.carTime,
      highlights: destination.highlights,
      activities: destination.activities_list
    };

    return NextResponse.json({
      success: true,
      data: formattedDestination
    });

  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch destination'
      },
      { status: 500 }
    );
  }
}