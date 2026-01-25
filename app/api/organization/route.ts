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

    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      include: {
        _count: {
          select: {
            users: true,
            dataSets: true,
            renderJobs: true,
          },
        },
      },
    })

    if (!organization) {
      return ApiErrors.notFound('Organization not found')
    }

    return NextResponse.json({ organization })
  } catch (error) {
    return handlePrismaError(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return ApiErrors.unauthorized()
    }

    // Check if user is admin or owner
    if (!['OWNER', 'ADMIN'].includes(session.user.role)) {
      return ApiErrors.forbidden('Only admins can update organization settings')
    }

    const body = await request.json()
    const { name } = body

    const organization = await prisma.organization.update({
      where: { id: session.user.organizationId },
      data: {
        ...(name && { name }),
      },
    })

    return NextResponse.json({ organization })
  } catch (error) {
    return handlePrismaError(error)
  }
}
