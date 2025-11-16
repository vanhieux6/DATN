import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Lấy danh sách packages
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
        { title: { contains: search, mode: 'insensitive' } }, // Đổi từ name thành title
        { subtitle: { contains: search, mode: 'insensitive' } }, // Thêm subtitle
        { destination: { 
            city: { contains: search, mode: 'insensitive' } 
          }
        } // Sửa cách search destination
      ];
    }

    if (category) {
      where.category = category;
    }

    // Lấy packages với pagination từ database
    const [packages, total] = await Promise.all([
      prisma.tourPackage.findMany({
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
      prisma.tourPackage.count({ where })
    ]);

    return NextResponse.json({
      packages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Tạo package mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation - sử dụng field names từ schema
    const requiredFields = ['title', 'subtitle', 'duration', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Tạo package mới trong database
    const tourPackage = await prisma.tourPackage.create({
      data: {
        title: body.title, // Đổi từ name thành title
        subtitle: body.subtitle, // Thêm subtitle
        image: body.image || 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop',
        badge: body.badge || null,
        discount: body.discount || '0%',
        originalPrice: body.originalPrice || body.price,
        price: body.price,
        duration: body.duration,
        groupSize: body.groupSize || '1-20 người', // Đổi từ maxGroupSize thành groupSize
        departure: body.departure || 'Hà Nội',
        destinationId: body.destinationId || null, // Sử dụng destinationId thay vì destination string
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        validUntil: body.validUntil || '2024-12-31',
        category: body.category || 'General'
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

    return NextResponse.json(tourPackage, { status: 201 });
  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}