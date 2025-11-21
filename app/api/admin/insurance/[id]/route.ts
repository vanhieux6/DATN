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
    const insurance = await prisma.insurance.findUnique({
      where: { id },
      include: {
        destinations: true,
        features: true,
        exclusions: true
      }
    })
    
    if (!insurance) {
      return NextResponse.json(
        { error: 'Insurance not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(insurance)
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

    const insurance = await prisma.insurance.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        type: body.type,
        price: parseFloat(body.price),
        duration: body.duration,
        coverage: body.coverage,
        claimProcess: body.claimProcess,
        maxAge: parseInt(body.maxAge),
        preExistingConditions: body.preExistingConditions === "true",
      },
      include: {
        destinations: true,
        features: true,
        exclusions: true
      }
    })

    return NextResponse.json(insurance)
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
    
    await prisma.insurance.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Insurance deleted successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    )
  }
}