// app/api/flights/bookings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const bookingCode = searchParams.get('bookingCode');

    if (!userId && !bookingCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing parameters',
          message: 'Thiếu tham số tìm kiếm'
        },
        { status: 400 }
      );
    }

    const where: any = {};
    if (userId) where.userId = userId;
    if (bookingCode) where.bookingCode = bookingCode;

    const bookings = await prisma.flightBooking.findMany({
      where,
      include: {
        flight: {
          select: {
            airline: true,
            flightNumber: true,
            departure: true,
            arrival: true,
            departureTime: true,
            arrivalTime: true,
            departureDate: true,
            class: true,
            duration: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const transformedBookings = bookings.map(booking => ({
      id: booking.id,
      bookingCode: booking.bookingCode,
      flight: {
        airline: booking.flight.airline,
        flightNumber: booking.flight.flightNumber,
        departure: booking.flight.departure,
        arrival: booking.flight.arrival,
        departureTime: booking.flight.departureTime,
        arrivalTime: booking.flight.arrivalTime,
        departureDate: booking.flight.departureDate,
        class: booking.flight.class,
        duration: booking.flight.duration
      },
      passengers: booking.passengers,
      totalPrice: booking.totalPrice,
      status: booking.status,
      createdAt: booking.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: transformedBookings,
      total: transformedBookings.length
    });

  } catch (error) {
    console.error('Error fetching flight bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Không thể lấy thông tin đặt vé'
      },
      { status: 500 }
    );
  }
}