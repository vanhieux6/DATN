// File: app/api/admin/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

interface RouteContext {
  params: Promise<{ id: string }>
}

// Helper find user
async function findUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          hotelBookings: true,
          flightBookings: true,
          packageBookings: true
        }
      }
    }
  })
  if (!user) throw new Error('User not found')
  return user
}

// GET
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await findUser(id)
    return NextResponse.json(user)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('User not found') ? 404 : 400 }
    )
  }
}

// PUT
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    await findUser(id)

    const body = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        avatar: body.avatar
        // Nếu muốn update role/status, uncomment khi bảng có field tương ứng
        // role: body.role,
        // status: body.status
      },
      include: {
        _count: {
          select: {
            hotelBookings: true,
            flightBookings: true,
            packageBookings: true
          }
        }
      }
    })

    return NextResponse.json(updatedUser)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('User not found') ? 404 : 400 }
    )
  }
}

// DELETE
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const user = await findUser(id)

    if (
      user._count.hotelBookings > 0 ||
      user._count.flightBookings > 0 ||
      user._count.packageBookings > 0
    ) {
      return NextResponse.json(
        { error: 'Cannot delete user with related bookings. Please remove related bookings first.' },
        { status: 400 }
      )
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('User not found') ? 404 : 400 }
    )
  }
}
