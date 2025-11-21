import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [insurance, total] = await Promise.all([
      prisma.insurance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          destinations: true,
          features: true,
          exclusions: true,
          _count: {
            select: {
              policies: true
            }
          }
        }
      }),
      prisma.insurance.count({ where })
    ]);

    return NextResponse.json({
      insurance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get insurance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const requiredFields = ['title', 'type', 'price', 'duration', 'coverage'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    const insurance = await prisma.insurance.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || '',
        image: body.image || 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
        type: body.type,
        price: parseFloat(body.price),
        duration: body.duration,
        coverage: body.coverage,
        claimProcess: body.claimProcess || '',
        maxAge: body.maxAge || 65,
        preExistingConditions: body.preExistingConditions || false,
        rating: 0,
        reviewCount: 0,
      },
      include: {
        destinations: true,
        features: true,
        exclusions: true
      }
    });

    return NextResponse.json(insurance, { status: 201 });
  } catch (error) {
    console.error('Create insurance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}