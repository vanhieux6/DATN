// app/api/hotels/route.tsx
import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const priceRange = searchParams.get('priceRange');
    const rating = searchParams.get('rating');
    const destination = searchParams.get('destination'); // Thêm destination từ HeroSection

    // Build where clause for filtering
    const where: any = {};
    
    // Ưu tiên destination từ HeroSection, nếu không có thì dùng location từ filter
    const searchLocation = destination || location;
    
    if (searchLocation && searchLocation !== 'all') {
      where.OR = [
        {
          location: {
            contains: searchLocation,
            mode: 'insensitive'
          }
        },
        {
          name: {
            contains: searchLocation,
            mode: 'insensitive'
          }
        },
        {
          destination: {
            city: {
              contains: searchLocation,
              mode: 'insensitive'
            }
          }
        },
        {
          destination: {
            province: {
              contains: searchLocation,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    if (rating && rating !== 'all') {
      where.rating = {
        gte: parseFloat(rating)
      };
    }

    if (priceRange && priceRange !== 'all') {
      switch (priceRange) {
        case 'budget':
          where.price = { lt: 1000000 };
          break;
        case 'mid':
          where.price = { gte: 1000000, lte: 3000000 };
          break;
        case 'high':
          where.price = { gt: 3000000, lte: 5000000 };
          break;
        case 'luxury':
          where.price = { gt: 5000000 };
          break;
      }
    }

    // Fetch hotels with amenities and room types
    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        amenities: true,
        roomTypes: true,
        destination: {
          select: {
            city: true,
            province: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    // Transform data to match frontend expectations
    const transformedHotels = hotels.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      image: hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
      location: hotel.destination ? `${hotel.destination.city}, ${hotel.destination.province}` : hotel.location,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount || Math.floor(Math.random() * 500) + 50,
      price: hotel.price,
      originalPrice: hotel.originalPrice,
      discount: hotel.discount,
      amenities: hotel.amenities.map((a: any) => a.name),
      roomTypes: hotel.roomTypes.map((r: any) => r.name),
      description: hotel.description
    }));

    return NextResponse.json({
      success: true,
      data: transformedHotels,
      total: transformedHotels.length,
      filters: {
        location: searchLocation,
        priceRange,
        rating
      }
    });

  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Không thể lấy dữ liệu khách sạn'
      },
      { status: 500 }
    );
  }
}
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const location = searchParams.get('location');
//     const priceRange = searchParams.get('priceRange');
//     const rating = searchParams.get('rating');

//     // Build where clause for filtering
//     const where: any = {};
    
//     if (location && location !== 'all') {
//       where.location = {
//         contains: location,
//         mode: 'insensitive'
//       };
//     }

//     if (rating && rating !== 'all') {
//       where.rating = {
//         gte: parseFloat(rating)
//       };
//     }

//     if (priceRange && priceRange !== 'all') {
//       switch (priceRange) {
//         case 'budget':
//           where.price = { lt: 1000000 };
//           break;
//         case 'mid':
//           where.price = { gte: 1000000, lte: 3000000 };
//           break;
//         case 'high':
//           where.price = { gt: 3000000, lte: 5000000 };
//           break;
//         case 'luxury':
//           where.price = { gt: 5000000 };
//           break;
//       }
//     }

//     // Fetch hotels with amenities and room types
//     const hotels = await prisma.hotel.findMany({
//       where,
//       include: {
//         amenities: true,
//         roomTypes: true,
//         destination: {
//           select: {
//             city: true,
//             province: true
//           }
//         }
//       },
//       orderBy: {
//         rating: 'desc'
//       }
//     });

//     // Transform data to match frontend expectations
//     const transformedHotels = hotels.map((hotel: any) => ({
//       id: hotel.id,
//       name: hotel.name,
//       image: hotel.image,
//       location: hotel.location,
//       rating: hotel.rating,
//       reviewCount: hotel.reviewCount,
//       price: hotel.price,
//       originalPrice: hotel.originalPrice,
//       discount: hotel.discount,
//       amenities: hotel.amenities.map((a: any) => a.name),
//       roomTypes: hotel.roomTypes.map((r: any) => r.name),
//       description: hotel.description
//     }));

//     return NextResponse.json({
//       success: true,
//       data: transformedHotels,
//       total: transformedHotels.length,
//       filters: {
//         location,
//         priceRange,
//         rating
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching hotels:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Internal server error',
//         message: 'Không thể lấy dữ liệu khách sạn'
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.hotelId || !body.userId || !body.checkIn || !body.checkOut || !body.guests || !body.totalPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Thiếu thông tin bắt buộc'
        },
        { status: 400 }
      );
    }

    // Create new hotel booking
    const newBooking = await prisma.hotelBooking.create({
      data: {
        hotelId: body.hotelId,
        userId: body.userId,
        checkIn: body.checkIn,
        checkOut: body.checkOut,
        guests: body.guests,
        totalPrice: body.totalPrice,
        status: 'pending'
      },
      include: {
        hotel: {
          select: {
            name: true,
            location: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Đặt phòng thành công',
      data: {
        id: newBooking.id,
        hotelId: newBooking.hotelId,
        hotelName: newBooking.hotel.name,
        location: newBooking.hotel.location,
        checkIn: newBooking.checkIn,
        checkOut: newBooking.checkOut,
        guests: newBooking.guests,
        totalPrice: newBooking.totalPrice,
        status: newBooking.status,
        createdAt: newBooking.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating hotel booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Bad request',
        message: 'Dữ liệu đặt phòng không hợp lệ'
      },
      { status: 400 }
    );
  }
} 