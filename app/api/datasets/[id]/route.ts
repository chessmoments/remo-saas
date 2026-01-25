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

    const dataset = await prisma.dataSet.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        renderJobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!dataset) {
      return ApiErrors.notFound('Dataset not found')
    }

    return NextResponse.json({ dataset })
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const { id } = await params
    const body = await request.json()
    const { name, rawData } = body

    const existing = await prisma.dataSet.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    })

    if (!existing) {
      return ApiErrors.notFound('Dataset not found')
    }

    const dataset = await prisma.dataSet.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(rawData && { rawData, parsedData: rawData }),
      },
    })

    return NextResponse.json({ dataset })
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

    const existing = await prisma.dataSet.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    })

    if (!existing) {
      return ApiErrors.notFound('Dataset not found')
    }

    await prisma.dataSet.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handlePrismaError(error)
  }
}
