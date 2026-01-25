import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const ApiErrors = {
  badRequest: (message = 'Bad request') =>
    NextResponse.json({ error: message, code: 'BAD_REQUEST' }, { status: 400 }),

  unauthorized: (message = 'Unauthorized') =>
    NextResponse.json({ error: message, code: 'UNAUTHORIZED' }, { status: 401 }),

  forbidden: (message = 'Forbidden') =>
    NextResponse.json({ error: message, code: 'FORBIDDEN' }, { status: 403 }),

  notFound: (message = 'Not found') =>
    NextResponse.json({ error: message, code: 'NOT_FOUND' }, { status: 404 }),

  conflict: (message = 'Conflict') =>
    NextResponse.json({ error: message, code: 'CONFLICT' }, { status: 409 }),

  rateLimited: (message = 'Too many requests') =>
    NextResponse.json({ error: message, code: 'RATE_LIMITED' }, { status: 429 }),

  internal: (message = 'Internal server error', error?: unknown) => {
    if (error) {
      console.error('Internal error:', error)
    }
    return NextResponse.json(
      { error: message, code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  },

  serviceUnavailable: (message = 'Service unavailable') =>
    NextResponse.json(
      { error: message, code: 'SERVICE_UNAVAILABLE' },
      { status: 503 }
    ),
}

export function handlePrismaError(error: unknown): NextResponse {
  const prismaError = error as { code?: string; meta?: { target?: string[] } }

  if (prismaError.code === 'P2025') {
    return ApiErrors.notFound('Record not found')
  }

  if (prismaError.code === 'P2002') {
    const target = prismaError.meta?.target?.join(', ') || 'field'
    return ApiErrors.conflict(`Duplicate value for ${target}`)
  }

  return ApiErrors.internal('Database error', error)
}
