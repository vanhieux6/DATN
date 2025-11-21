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

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        destination: {
          select: {
            city: true,
            province: true
          }
        },
        highlights: true,
        included: true,
        availableDates: true
      }
    })
    
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(activity)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const body = await request.json()

    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        category: body.category,
        location: body.location,
        duration: body.duration,
        groupSize: body.groupSize,
        price: parseFloat(body.price),
        originalPrice: parseFloat(body.originalPrice),
        discount: body.discount,
        difficulty: body.difficulty,
        ageRequirement: body.ageRequirement,
        schedule: body.schedule,
        bestTime: body.bestTime,
      },
      include: {
        destination: {
          select: {
            city: true,
            province: true
          }
        }
      }
    })

    return NextResponse.json(activity)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    
    await prisma.activity.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Activity deleted successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}