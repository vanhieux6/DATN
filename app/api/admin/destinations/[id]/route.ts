// File: app/api/admin/destinations/[id]/route.ts
import { prisma } from '@/app/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

interface RouteContext {
  params: Promise<{ id: string }> // App Router expect params as Promise
}

// Helper: parse ID hoặc throw lỗi
async function getId(params: Promise<{ id: string }>) {
  const realParams = await params
  const id = parseInt(realParams.id)
  if (isNaN(id)) throw new Error('Invalid ID')
  return id
}

// Helper: kiểm tra tồn tại destination
async function findDestination(id: number) {
  const dest = await prisma.destination.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          hotels_relation: true,
          activities_relation: true,
          packages_relation: true,
          reviews: true,
          highlights: true,
          activities_list: true
        }
      }
    }
  })
  if (!dest) throw new Error('Destination not found')
  return dest
}

// GET - Lấy destination theo ID
export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const destination = await findDestination(id)
    return NextResponse.json(destination)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}

// PUT - Cập nhật destination
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    await findDestination(id) // đảm bảo tồn tại

    const body = await req.json()

    const updated = await prisma.destination.update({
      where: { id },
      data: body // giả sử frontend gửi đúng fields
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}

// DELETE - Xóa destination
export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const id = await getId(context.params)
    const destination = await findDestination(id)

    // Kiểm tra ràng buộc liên quan trước khi xóa
    if (Object.values(destination._count).some(count => count > 0)) {
      return NextResponse.json(
        { error: 'Cannot delete destination with related data.' },
        { status: 400 }
      )
    }

    await prisma.destination.delete({ where: { id } })
    return NextResponse.json({ message: 'Destination deleted successfully' })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.message.includes('Invalid') ? 400 : 404 }
    )
  }
}
