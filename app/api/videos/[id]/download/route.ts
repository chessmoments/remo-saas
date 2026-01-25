import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSignedDownloadUrl } from '@/lib/s3'
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
        videoUrl: { not: null },
      },
    })

    if (!video || !video.videoUrl) {
      return ApiErrors.notFound('Video not found')
    }

    // Generate signed download URL (1 hour expiry)
    const downloadUrl = await getSignedDownloadUrl(video.videoUrl, 3600)

    return NextResponse.json({
      downloadUrl,
      expiresIn: 3600,
    })
  } catch (error) {
    return handlePrismaError(error)
  }
}
