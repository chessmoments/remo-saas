import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiErrors, handlePrismaError } from '@/lib/api-error'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const videos = await prisma.renderJob.findMany({
      where: {
        organizationId: session.user.organizationId,
        status: 'COMPLETED',
        videoUrl: { not: null },
        ...(category && { category: category as any }),
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        dataSet: {
          select: { name: true, category: true },
        },
      },
    })

    const total = await prisma.renderJob.count({
      where: {
        organizationId: session.user.organizationId,
        status: 'COMPLETED',
        videoUrl: { not: null },
        ...(category && { category: category as any }),
      },
    })

    return NextResponse.json({
      videos,
      total,
      limit,
      offset,
    })
  } catch (error) {
    return handlePrismaError(error)
  }
}
