import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSignedUploadUrl } from '@/lib/s3'
import { ApiErrors, handlePrismaError } from '@/lib/api-error'

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    if (!['OWNER', 'ADMIN'].includes(session.user.role)) {
      return ApiErrors.forbidden('Only admins can update branding')
    }

    const body = await request.json()
    const { logoUrl, primaryColor, secondaryColor, accentColor, fontFamily } = body

    // Validate hex colors
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    if (primaryColor && !hexRegex.test(primaryColor)) {
      return ApiErrors.badRequest('Invalid primaryColor format. Use hex format: #RRGGBB')
    }
    if (secondaryColor && !hexRegex.test(secondaryColor)) {
      return ApiErrors.badRequest('Invalid secondaryColor format. Use hex format: #RRGGBB')
    }
    if (accentColor && !hexRegex.test(accentColor)) {
      return ApiErrors.badRequest('Invalid accentColor format. Use hex format: #RRGGBB')
    }

    const organization = await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        ...(logoUrl !== undefined && { logoUrl }),
        ...(primaryColor && { primaryColor }),
        ...(secondaryColor && { secondaryColor }),
        ...(accentColor && { accentColor }),
        ...(fontFamily && { fontFamily }),
      },
    })

    return NextResponse.json({ organization })
  } catch (error) {
    return handlePrismaError(error)
  }
}

// Get a signed URL for logo upload
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    if (!['OWNER', 'ADMIN'].includes(session.user.role)) {
      return ApiErrors.forbidden('Only admins can upload logos')
    }

    const body = await request.json()
    const { contentType } = body

    if (!contentType || !contentType.startsWith('image/')) {
      return ApiErrors.badRequest('Invalid content type. Must be an image.')
    }

    const extension = contentType.split('/')[1] || 'png'
    const key = `logos/${session.user.organizationId}/logo.${extension}`

    const uploadUrl = await getSignedUploadUrl(key, contentType, 300) // 5 min expiry

    return NextResponse.json({
      uploadUrl,
      key,
      logoUrl: key, // The key to save after upload
    })
  } catch (error) {
    return ApiErrors.internal('Failed to generate upload URL', error)
  }
}
