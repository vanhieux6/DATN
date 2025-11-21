// app/api/packages/[id]/route.ts
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id);
    const { searchParams } = new URL(request.url);
    const rich = searchParams.get('rich');

    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId },
      include: {
        destination: true,
        highlights: true,
        itinerary: true,
        included: true,
        notIncluded: true,
        images: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          where: {
            status: 'published'
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        sections: {
          orderBy: {
            position: 'asc'
          }
        },
        stops: {
          orderBy: {
            position: 'asc'
          }
        },
        ...(rich === '1' ? {
          bookings: {
            where: {
              status: { in: ['confirmed', 'pending'] }
            }
          }
        } : {})
      }
    });

    if (!tourPackage) {
      return NextResponse.json({ error: 'Tour package not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: tourPackage
    });

  } catch (error) {
    console.error('Get package error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}