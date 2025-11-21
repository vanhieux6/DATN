import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const activityId = parseInt(id);

    if (isNaN(activityId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid activity ID'
        },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        destination: {
          select: {
            city: true,
            province: true
          }
        },
        highlights: true,
        included: true,
        availableDates: {
          orderBy: { date: 'asc' }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    if (!activity) {
      return NextResponse.json(
        {
          success: false,
          message: 'Activity not found'
        },
        { status: 404 }
      );
    }

    // Format the response
    const formattedActivity = {
      id: activity.id,
      title: activity.title,
      subtitle: activity.subtitle,
      image: activity.image,
      category: activity.category,
      location: activity.location,
      duration: activity.duration,
      groupSize: activity.groupSize,
      price: activity.price,
      originalPrice: activity.originalPrice,
      discount: activity.discount,
      rating: activity.rating,
      reviewCount: activity.reviewCount,
      difficulty: activity.difficulty,
      ageRequirement: activity.ageRequirement,
      schedule: activity.schedule,
      bestTime: activity.bestTime,
      description: '',
      highlights: activity.highlights,
      included: activity.included,
      availableDates: activity.availableDates,
      destination: activity.destination
    };

    return NextResponse.json({
      success: true,
      data: formattedActivity
    });

  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch activity'
      },
      { status: 500 }
    );
  }
}