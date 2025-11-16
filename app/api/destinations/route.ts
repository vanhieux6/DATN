import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import type { Destination } from '@prisma/client/wasm';


export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      take: 4,
      orderBy: { rating: 'desc' },
      include: {
        _count: {
          select: {
            hotels_relation: true
          }
        },
        highlights: {
          select: {
            name: true,
            image: true
          },
          take: 3
        },
        activities_list: {
          select: {
            name: true,
            icon: true
          },
          take: 3
        }
      }
    });

    const formattedDestinations = destinations.map(destination => ({
      id: destination.id,
      city: destination.city,
      country: destination.country,
      image: destination.image,
      rating: destination.rating,
      reviewCount: destination.reviewCount,
      hotels: destination._count.hotels_relation,
      fromPrice: destination.fromPrice,
      toPrice: destination.toPrice,
      slug: destination.slug,
      highlights: destination.highlights,
      activities: destination.activities_list
    }));

    console.log(formattedDestinations, "format")

    return NextResponse.json({
      success: true,
      data: formattedDestinations
    });
    
  } catch (error) {
    console.log('err', error)
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch destinations',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.destinationId || !body.userId || !body.rating || !body.comment) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Thiếu thông tin bắt buộc'
        },
        { status: 400 }
      );
    }

    // Create new destination review
    const newReview = await prisma.destinationReview.create({
      data: {
        destinationId: body.destinationId,
        userId: body.userId,
        rating: body.rating,
        comment: body.comment,
        photos: body.photos || [],
        status: 'published'
      },
      include: {
        destination: {
          select: {
            city: true
          }
        }
      }
    });

    // Update destination rating and review count
    await prisma.destination.update({
      where: { id: body.destinationId },
      data: {
        reviewCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đánh giá điểm đến thành công',
      data: {
        id: newReview.id,
        destinationId: newReview.destinationId,
        destinationName: newReview.destination.city,
        rating: newReview.rating,
        comment: newReview.comment,
        photos: newReview.photos,
        status: newReview.status,
        createdAt: newReview.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating destination review:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Bad request',
        message: 'Dữ liệu đánh giá không hợp lệ'
      },
      { status: 400 }
    );
  }
} 