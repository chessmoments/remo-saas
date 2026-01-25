import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiErrors, handlePrismaError } from '@/lib/api-error'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const { id } = await params

    const video = await prisma.renderJob.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
        status: 'COMPLETED',
      },
      include: {
        dataSet: {
          select: { name: true, category: true },
        },
      },
    })

    if (!video) {
      return ApiErrors.notFound('Video not found')
    }

    return NextResponse.json({ video })
  } catch (error) {
    return handlePrismaError(error)
  }
}
