import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    const activities = await prisma.activity.findMany({
      where,
      take: limit,
      orderBy: { rating: 'desc' },
      include: {
        destination: {
          select: {
            city: true,
            province: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    });

    const formattedActivities = activities.map(activity => ({
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
    }));

    return NextResponse.json({
      success: true,
      activities: formattedActivities
    });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}