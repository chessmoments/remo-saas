import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiErrors, handlePrismaError } from '@/lib/api-error'
import { Category } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as Category | null

    const datasets = await prisma.dataSet.findMany({
      where: {
        organizationId: session.user.organizationId,
        ...(category && { category }),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { renderJobs: true },
        },
      },
    })

    return NextResponse.json({ datasets })
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const body = await request.json()
    const { name, category, rawData } = body

    if (!name || !category || !rawData) {
      return ApiErrors.badRequest('Missing required fields: name, category, rawData')
    }

    if (!Object.values(Category).includes(category)) {
      return ApiErrors.badRequest(`Invalid category: ${category}`)
    }

    const dataset = await prisma.dataSet.create({
      data: {
        name,
        category,
        rawData,
        organizationId: session.user.organizationId,
        parseStatus: 'COMPLETED', // For now, mark as completed immediately
        parsedData: rawData, // Simplified - in production, validate/transform
      },
    })

    return NextResponse.json({ dataset }, { status: 201 })
  } catch (error) {
    return handlePrismaError(error)
  }
}
