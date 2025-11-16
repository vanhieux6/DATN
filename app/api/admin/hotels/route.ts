import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
// api/hotels/route.ts
// GET - Lấy danh sách hotels
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const destinationId = searchParams.get('destinationId') || '';

    const skip = (page - 1) * limit;

    // Xây dựng where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (destinationId) {
      where.destinationId = parseInt(destinationId);
    }

    // Lấy hotels với pagination
    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          destination: {
            select: {
              city: true,
              province: true
            }
          }
        }
      }),
      prisma.hotel.count({ where })
    ]);

    return NextResponse.json({
      hotels,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get hotels error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Tạo hotel mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    const requiredFields = ['name', 'image', 'location', 'price', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Tạo hotel mới
    const hotel = await prisma.hotel.create({
      data: {
        name: body.name,
        image: body.image,
        location: body.location,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        price: body.price,
        originalPrice: body.originalPrice || body.price,
        discount: body.discount || '0%',
        description: body.description,
        destinationId: body.destinationId || null
      },
      include: {
        destination: {
          select: {
            city: true,
            province: true
          }
        }
      }
    });

    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error('Create hotel error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 