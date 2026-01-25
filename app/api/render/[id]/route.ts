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

    const renderJob = await prisma.renderJob.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        dataSet: {
          select: { name: true, category: true },
        },
      },
    })

    if (!renderJob) {
      return ApiErrors.notFound('Render job not found')
    }

    return NextResponse.json({ renderJob })
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const { id } = await params

    const existing = await prisma.renderJob.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    })

    if (!existing) {
      return ApiErrors.notFound('Render job not found')
    }

    // Only allow deletion of completed or failed jobs
    if (existing.status === 'RENDERING') {
      return ApiErrors.badRequest('Cannot delete a job that is currently rendering')
    }

    await prisma.renderJob.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handlePrismaError(error)
  }
}
