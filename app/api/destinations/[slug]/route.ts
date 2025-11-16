// File: app/api/destinations/[slug]/route.ts
import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ slug: string }> // Đã sửa: params phải là Promise
}

// --------------------
// GET /api/destinations/[slug]
export async function GET(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params // Đã sửa: await params

  try {
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        highlights: true,
        activities_list: true,
        hotels_relation: {
          include: {
            amenities: true,
            roomTypes: true
          }
        }
      }
    })

    if (!destination) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy điểm đến' }, { status: 404 })
    }

    const transformedDestination = {
      id: destination.id,
      name: destination.city,
      slug: destination.slug,
      country: destination.country,
      province: destination.province,
      description: destination.description,
      heroImage: destination.heroImage || destination.image,
      rating: destination.rating,
      reviewCount: destination.reviewCount,
      bestTime: destination.bestTime,
      weather: {
        temperature: destination.temperature || 'N/A',
        condition: destination.condition || 'N/A',
        humidity: destination.humidity || 'N/A',
        rainfall: destination.rainfall || 'N/A'
      },
      transportation: {
        flight: destination.flightTime || 'N/A',
        ferry: destination.ferryTime || 'N/A',
        car: destination.carTime || 'N/A'
      },
      highlights: destination.highlights.map(h => ({
        name: h.name,
        description: h.description,
        image: h.image,
        rating: h.rating
      })),
      activities: destination.activities_list.map(a => ({
        name: a.name,
        icon: a.icon,
        description: a.description
      })),
      hotels: destination.hotels_relation.map(h => ({
        name: h.name,
        image: h.image,
        rating: h.rating,
        price: `${h.price.toLocaleString()}đ`,
        location: h.location,
        features: h.amenities.map(a => a.name)
      }))
    }

    return NextResponse.json({ success: true, data: transformedDestination })
  } catch (error) {
    console.error('GET destination error:', error)
    return NextResponse.json({ success: false, message: 'Không thể lấy thông tin điểm đến' }, { status: 500 })
  }
}

// --------------------
// PUT /api/destinations/[slug]
export async function PUT(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params // Đã sửa: await params
  
  try {
    const body = await req.json()
    const existing = await prisma.destination.findUnique({ where: { slug } })
    if (!existing) return NextResponse.json({ success: false, message: 'Điểm đến không tồn tại' }, { status: 404 })

    const updated = await prisma.destination.update({
      where: { slug },
      data: {
        city: body.city,
        country: body.country,
        province: body.province,
        description: body.description,
        heroImage: body.heroImage,
        rating: body.rating,
        reviewCount: body.reviewCount,
        bestTime: body.bestTime,
        temperature: body.temperature,
        condition: body.condition,
        humidity: body.humidity,
        rainfall: body.rainfall,
        flightTime: body.flightTime,
        ferryTime: body.ferryTime,
        carTime: body.carTime
      }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('PUT destination error:', error)
    return NextResponse.json({ success: false, message: 'Không thể cập nhật điểm đến' }, { status: 500 })
  }
}

// --------------------
// DELETE /api/destinations/[slug]
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { slug } = await context.params // Đã sửa: await params
  
  try {
    const existing = await prisma.destination.findUnique({ where: { slug } })
    if (!existing) return NextResponse.json({ success: false, message: 'Điểm đến không tồn tại' }, { status: 404 })

    const related = await prisma.destination.findUnique({
      where: { slug },
      include: { hotels_relation: true, activities_list: true, highlights: true }
    })

    if (related && (related.hotels_relation.length || related.activities_list.length || related.highlights.length)) {
      return NextResponse.json({ success: false, message: 'Không thể xóa điểm đến có dữ liệu liên quan' }, { status: 400 })
    }

    await prisma.destination.delete({ where: { slug } })
    return NextResponse.json({ success: true, message: 'Xóa điểm đến thành công' })
  } catch (error) {
    console.error('DELETE destination error:', error)
    return NextResponse.json({ success: false, message: 'Không thể xóa điểm đến' }, { status: 500 })
  }
}