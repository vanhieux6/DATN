import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Parallel queries để tối ưu performance
    const [
      destinationsCount,
      hotelsCount,
      flightsCount,
      packagesCount,
      activitiesCount,
      insuranceCount,
      bookingsCount,
      usersCount,
      thisMonthBookings,
      lastMonthBookings
    ] = await Promise.all([
      prisma.destination.count(),
      prisma.hotel.count(),
      prisma.flight.count(),
      prisma.tourPackage.count(),
      prisma.activity.count(),
      prisma.insurance.count(),
      // Tổng số booking từ tất cả các loại
      Promise.all([
        prisma.hotelBooking.count(),
        prisma.flightBooking.count(),
        prisma.packageBooking.count(),
        prisma.activityBooking.count()
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      prisma.user.count(),
      // Booking tháng này
      Promise.all([
        prisma.hotelBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        }),
        prisma.flightBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        }),
        prisma.packageBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        }),
        prisma.activityBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        })
      ]),
      // Booking tháng trước
      Promise.all([
        prisma.hotelBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        }),
        prisma.flightBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        }),
        prisma.packageBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        }),
        prisma.activityBooking.aggregate({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
              lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          _sum: { totalPrice: true }
        })
      ])
    ])

    // Tính tổng doanh thu tháng này
    const thisMonthRevenue = thisMonthBookings.reduce((sum, booking) => {
      return sum + (booking._sum.totalPrice || 0)
    }, 0)

    // Tính tổng doanh thu tháng trước
    const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => {
      return sum + (booking._sum.totalPrice || 0)
    }, 0)

    // Tính tỷ lệ tăng trưởng
    const growth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : thisMonthRevenue > 0 ? 100 : 0

    const stats = {
      destinations: destinationsCount,
      hotels: hotelsCount,
      flights: flightsCount,
      packages: packagesCount,
      activities: activitiesCount,
      insurance: insuranceCount,
      bookings: bookingsCount,
      users: usersCount,
      revenue: thisMonthRevenue,
      growth: Math.round(growth * 100) / 100
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}