import { verifyUser } from '@/app/lib/auth-ultils';
import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id);
    
    // Check authentication using JWT
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, comment, photos = [] } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1-5' }, 
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Comment is required' }, 
        { status: 400 }
      );
    }

    if (comment.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Comment must be less than 1000 characters' }, 
        { status: 400 }
      );
    }

    // Check if package exists
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId }
    });

    if (!tourPackage) {
      return NextResponse.json(
        { success: false, error: 'Tour package not found' }, 
        { status: 404 }
      );
    }

    // Check if user has already reviewed this package
    const existingReview = await prisma.tourPackageReview.findFirst({
      where: {
        packageId,
        userId: user.id
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this package' }, 
        { status: 400 }
      );
    }

    // Check if user has booked this package (optional requirement)
    const userBooking = await prisma.packageBooking.findFirst({
      where: {
        packageId,
        userId: user.id,
        status: 'confirmed'
      }
    });

    // If you want to require booking before review, uncomment this:
    /*
    if (!userBooking) {
      return NextResponse.json(
        { success: false, error: 'You must book this package before reviewing' }, 
        { status: 400 }
      );
    }
    */

    // Create review
    const review = await prisma.tourPackageReview.create({
      data: {
        packageId,
        userId: user.id,
        name: user.name,
        rating: parseFloat(rating),
        comment: comment.trim(),
        photos: photos.filter((photo: string) => photo.trim() !== ''),
        status: 'published'
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    });

    // Update package rating and review count
    const packageReviews = await prisma.tourPackageReview.findMany({
      where: { 
        packageId,
        status: 'published'
      }
    });

    const averageRating = packageReviews.reduce((sum, review) => sum + review.rating, 0) / packageReviews.length;
    const reviewCount = packageReviews.length;

    await prisma.tourPackage.update({
      where: { id: packageId },
      data: {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount
      }
    });

    return NextResponse.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const packageId = parseInt(id);

    // Check if package exists
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id: packageId }
    });

    if (!tourPackage) {
      return NextResponse.json(
        { success: false, error: 'Tour package not found' }, 
        { status: 404 }
      );
    }

    const reviews = await prisma.tourPackageReview.findMany({
      where: { 
        packageId,
        status: 'published'
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}