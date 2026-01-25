import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/api/datasets', '/api/render', '/api/organization', '/api/videos']

// Public routes that don't require auth
const publicRoutes = ['/', '/login', '/api/auth']

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (isProtected) {
    const session = await auth()

    if (!session?.user) {
      // Redirect to login for page requests
      if (!pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      // Return 401 for API requests
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
