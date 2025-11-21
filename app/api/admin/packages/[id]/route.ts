// app/api/admin/packages/[id]/route.ts
import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

async function getId(params: Promise<{ id: string }>) {
  const realParams = await params
  const id = parseInt(realParams.id)
  if (isNaN(id)) throw new Error('Invalid ID')
  return id
}

// GET với rich data
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const { searchParams } = new URL(request.url)
    const rich = searchParams.get('rich')
    
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        destination: { select: { city: true, province: true, country: true } },
        highlights: true,
        itinerary: { orderBy: { day: 'asc' } },
        included: true,
        notIncluded: true,
        sections: { orderBy: { position: 'asc' } },
        stops: { orderBy: { position: 'asc' } },
        images: { orderBy: { position: 'asc' } },
        _count: { select: { bookings: true } }
      }
    })
    
    if (!tourPackage) {
      return NextResponse.json(
        { error: 'Tour package not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(tourPackage)
  } catch (err: any) {
    console.error('GET package error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: err.message?.includes('Invalid') ? 400 : 500 }
    )
  }
}

// PUT với rich data
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const body = await req.json()

    // Start transaction for complex update
    const result = await prisma.$transaction(async (tx) => {
      // Update basic info
      const updatedPackage = await tx.tourPackage.update({
        where: { id },
        data: {
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          image: body.image,
          badge: body.badge,
          discount: body.discount,
          originalPrice: parseFloat(body.originalPrice) || parseFloat(body.price),
          price: parseFloat(body.price),
          duration: body.duration,
          groupSize: body.groupSize,
          departure: body.departure,
          category: body.category,
          validUntil: body.validUntil,
        },
      })

      // Update highlights
      if (body.highlights) {
        await tx.packageHighlight.deleteMany({ where: { packageId: id } })
        if (body.highlights.length > 0) {
          await tx.packageHighlight.createMany({
            data: body.highlights
              .filter((h: any) => h.description && h.description.trim())
              .map((h: any) => ({
                packageId: id,
                description: h.description,
              }))
          })
        }
      }

      // Update itinerary
      if (body.itinerary) {
        await tx.packageItinerary.deleteMany({ where: { packageId: id } })
        if (body.itinerary.length > 0) {
          await tx.packageItinerary.createMany({
            data: body.itinerary
              .filter((i: any) => i.day && i.day.trim() && i.content && i.content.trim())
              .map((i: any, index: number) => ({
                packageId: id,
                day: i.day,
                content: i.content,
                startTime: i.startTime || null,
                transport: i.transport || null,
                meals: i.meals || null,
                position: index,
              }))
          })
        }
      }

      // Update included/excluded
      if (body.included) {
        await tx.packageIncluded.deleteMany({ where: { packageId: id } })
        if (body.included.length > 0) {
          await tx.packageIncluded.createMany({
            data: body.included
              .filter((i: any) => i.item && i.item.trim())
              .map((i: any) => ({
                packageId: id,
                item: i.item,
              }))
          })
        }
      }

      if (body.notIncluded) {
        await tx.packageNotIncluded.deleteMany({ where: { packageId: id } })
        if (body.notIncluded.length > 0) {
          await tx.packageNotIncluded.createMany({
            data: body.notIncluded
              .filter((i: any) => i.item && i.item.trim())
              .map((i: any) => ({
                packageId: id,
                item: i.item,
              }))
          })
        }
      }

      // Update sections
      if (body.sections) {
        await tx.tourPackageSection.deleteMany({ where: { packageId: id } })
        if (body.sections.length > 0) {
          await tx.tourPackageSection.createMany({
            data: body.sections
              .filter((s: any) => s.title && s.title.trim() && s.content && s.content.trim())
              .map((s: any, index: number) => ({
                packageId: id,
                title: s.title,
                content: s.content,
                photos: s.photos || [],
                position: index,
              }))
          })
        }
      }

      // Update stops
      if (body.stops) {
        await tx.tourPackageStop.deleteMany({ where: { packageId: id } })
        if (body.stops.length > 0) {
          await tx.tourPackageStop.createMany({
            data: body.stops
              .filter((s: any) => s.title && s.title.trim() && s.description && s.description.trim())
              .map((s: any, index: number) => ({
                packageId: id,
                title: s.title,
                description: s.description,
                guide: s.guide || '',
                photos: s.photos || [],
                tips: s.tips || [],
                position: index,
              }))
          })
        }
      }

      // Update images
      if (body.additionalImages) {
        await tx.tourPackageImage.deleteMany({ where: { packageId: id } })
        if (body.additionalImages.length > 0) {
          await tx.tourPackageImage.createMany({
            data: body.additionalImages
              .filter((img: any) => img.url && img.url.trim())
              .map((img: any, index: number) => ({
                packageId: id,
                url: img.url,
                caption: img.caption || '',
                position: index,
              }))
          })
        }
      }

      return updatedPackage
    })

    // Fetch the updated package with all relations
    const updatedPackageWithRelations = await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        destination: { select: { city: true, province: true, country: true } },
        highlights: true,
        itinerary: { orderBy: { day: 'asc' } },
        included: true,
        notIncluded: true,
        sections: { orderBy: { position: 'asc' } },
        stops: { orderBy: { position: 'asc' } },
        images: { orderBy: { position: 'asc' } },
      }
    })

    return NextResponse.json(updatedPackageWithRelations)
  } catch (err: any) {
    console.error('PUT package error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const tourPackage = await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        _count: { select: { bookings: true } }
      }
    })

    if (!tourPackage) {
      return NextResponse.json(
        { error: 'Tour package not found' },
        { status: 404 }
      )
    }

    if (tourPackage._count.bookings > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with related bookings.' },
        { status: 400 }
      )
    }

    await prisma.tourPackage.delete({ where: { id } })
    return NextResponse.json({ message: 'Tour package deleted successfully' })
  } catch (err: any) {
    console.error('DELETE package error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: err.message?.includes('Invalid') ? 400 : 500 }
    )
  }
}