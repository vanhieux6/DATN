// File: app/api/admin/tourPackage/[id]/route.ts
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

// Helper find tour package
async function findPackage(id: number) {
  const tourPackage = await prisma.tourPackage.findUnique({
    where: { id },
    include: {
      destination: { select: { city: true, province: true } },
      _count: { select: { bookings: true } }
    }
  })
  if (!tourPackage) throw new Error('Tour package not found')
  return tourPackage
}

// GET
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        destination: { select: { city: true, province: true } }
      }
    })
    if (!tourPackage) throw new Error('Tour package not found')
    return NextResponse.json(tourPackage)
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
    await findPackage(id) // ensure exists

    const body = await req.json()

    const updatedPackage = await prisma.tourPackage.update({
      where: { id },
      data: {
        title: body.name,
        subtitle: body.description,
        destinationId: body.destinationId, // nếu frontend gửi ID
        duration: body.duration,
        price: body.price,
        originalPrice: body.originalPrice,
        discount: body.discount,
        rating: body.rating,
        reviewCount: body.reviewCount,
        groupSize: body.maxGroupSize,
        departure: body.difficulty,
        category: body.category,
        image: body.image
      },
      include: {
        destination: { select: { city: true, province: true } }
      }
    })

    return NextResponse.json(updatedPackage)
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
    const tourPackage = await findPackage(id)

    if (tourPackage._count.bookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with related bookings.' },
        { status: 400 }
      )
    }

    await prisma.tourPackage.delete({ where: { id } })
    return NextResponse.json({ message: 'Tour package deleted successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}
