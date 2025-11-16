import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Lấy danh sách destinations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    // Xây dựng where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { city: { contains: search, mode: 'insensitive' } },
        { province: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.category = category;
    }

    // Lấy destinations với pagination
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              hotels_relation: true,
              activities_relation: true,
              packages_relation: true
            }
          }
        }
      }),
      prisma.destination.count({ where })
    ]);

    // Format data
    const formattedDestinations = destinations.map((dest: any) => ({
      id: dest.id,
      city: dest.city,
      country: dest.country,
      province: dest.province,
      description: dest.description,
      image: dest.image,
      heroImage: dest.heroImage,
      rating: dest.rating,
      reviewCount: dest.reviewCount,
      hotels: dest._count.hotels_relation,
      fromPrice: dest.fromPrice,
      toPrice: dest.toPrice,
      bestTime: dest.bestTime,
      category: dest.category,
      popularity: dest.popularity,
      slug: dest.slug,
      temperature: dest.temperature,
      condition: dest.condition,
      humidity: dest.humidity,
      rainfall: dest.rainfall,
      flightTime: dest.flightTime,
      ferryTime: dest.ferryTime,
      carTime: dest.carTime,
      createdAt: dest.createdAt,
      updatedAt: dest.updatedAt
    }));

    return NextResponse.json({
      destinations: formattedDestinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Tạo destination mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    const requiredFields = ['city', 'country', 'province', 'description', 'image', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Tạo slug từ city
    const slug = body.city.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Kiểm tra slug đã tồn tại
    const existingDestination = await prisma.destination.findUnique({
      where: { slug }
    });

    if (existingDestination) {
      return NextResponse.json(
        { error: 'Destination with this slug already exists' },
        { status: 400 }
      );
    }

    // Tạo destination mới
    const destination = await prisma.destination.create({
      data: {
        city: body.city,
        country: body.country || 'Việt Nam',
        province: body.province,
        description: body.description,
        image: body.image,
        heroImage: body.heroImage,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        hotels: body.hotels || 0,
        fromPrice: body.fromPrice || 0,
        toPrice: body.toPrice || 0,
        bestTime: body.bestTime,
        category: body.category,
        popularity: body.popularity || 'Trung bình',
        slug,
        temperature: body.temperature,
        condition: body.condition,
        humidity: body.humidity,
        rainfall: body.rainfall,
        flightTime: body.flightTime,
        ferryTime: body.ferryTime,
        carTime: body.carTime
      }
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Create destination error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 