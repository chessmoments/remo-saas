import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getRenderQueue } from '@/lib/queue'
import { ApiErrors, handlePrismaError } from '@/lib/api-error'
import { AspectRatio } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const dataSetId = searchParams.get('dataSetId')

    const jobs = await prisma.renderJob.findMany({
      where: {
        organizationId: session.user.organizationId,
        ...(status && { status: status as any }),
        ...(dataSetId && { dataSetId }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        dataSet: {
          select: { name: true, category: true },
        },
      },
    })

    return NextResponse.json({ jobs })
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
    const { dataSetId, templateId, aspectRatio = 'LANDSCAPE', inputProps } = body

    if (!dataSetId || !templateId) {
      return ApiErrors.badRequest('Missing required fields: dataSetId, templateId')
    }

    if (!Object.values(AspectRatio).includes(aspectRatio)) {
      return ApiErrors.badRequest(`Invalid aspectRatio: ${aspectRatio}`)
    }

    // Verify dataset belongs to org
    const dataset = await prisma.dataSet.findFirst({
      where: {
        id: dataSetId,
        organizationId: session.user.organizationId,
      },
    })

    if (!dataset) {
      return ApiErrors.notFound('Dataset not found')
    }

    // Get organization branding
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
    })

    // Create render job
    const renderJob = await prisma.renderJob.create({
      data: {
        category: dataset.category,
        templateId,
        aspectRatio,
        inputProps: {
          branding: {
            logoUrl: org?.logoUrl,
            primaryColor: org?.primaryColor,
            secondaryColor: org?.secondaryColor,
            accentColor: org?.accentColor,
            fontFamily: org?.fontFamily,
          },
          data: inputProps || dataset.parsedData,
        },
        dataSetId,
        organizationId: session.user.organizationId,
      },
    })

    // Queue the job
    const queue = getRenderQueue()
    const bullJob = await queue.add('render-video', {
      renderJobId: renderJob.id,
      compositionId: templateId,
      aspectRatio,
    })

    // Update with bull job id
    await prisma.renderJob.update({
      where: { id: renderJob.id },
      data: { bullJobId: bullJob.id },
    })

    return NextResponse.json({ renderJob }, { status: 201 })
  } catch (error) {
    return handlePrismaError(error)
  }
}
