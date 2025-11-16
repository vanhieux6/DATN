// File: app/api/admin/hotel/[id]/route.ts
import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

// Helper parse ID
async function getId(params: Promise<{ id: string }>) {
  const realParams = await params
  const id = parseInt(realParams.id)
  if (isNaN(id)) throw new Error('Invalid ID')
  return id
}

// Helper find hotel
async function findHotel(id: number) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      destination: { select: { city: true, province: true } },
      amenities: true,
      roomTypes: true,
      _count: { select: { amenities: true, roomTypes: true, bookings: true } }
    }
  })
  if (!hotel) throw new Error('Hotel not found')
  return hotel
}

// GET
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        destination: { select: { city: true, province: true } },
        amenities: true,
        roomTypes: true
      }
    })
    if (!hotel) throw new Error('Hotel not found')
    return NextResponse.json(hotel)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}

// PUT
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    await findHotel(id) // ensure exists

    const body = await req.json()

    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: {
        name: body.name,
        image: body.image,
        location: body.location,
        rating: body.rating,
        reviewCount: body.reviewCount,
        price: body.price,
        originalPrice: body.originalPrice,
        discount: body.discount,
        description: body.description,
        destinationId: body.destinationId
      },
      include: {
        destination: { select: { city: true, province: true } }
      }
    })

    return NextResponse.json(updatedHotel)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}

// DELETE
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const hotel = await findHotel(id)

    if (
      hotel._count.amenities > 0 ||
      hotel._count.roomTypes > 0 ||
      hotel._count.bookings > 0
    ) {
      return NextResponse.json(
        { error: 'Cannot delete hotel with related data.' },
        { status: 400 }
      )
    }

    await prisma.hotel.delete({ where: { id } })
    return NextResponse.json({ message: 'Hotel deleted successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}
