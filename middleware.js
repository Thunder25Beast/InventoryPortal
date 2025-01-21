import { NextResponse } from 'next/server'

// Protected routes that require admin access
const PROTECTED_ROUTES = [
  '/inventory/add',
  '/inventory/edit',
]

export async function middleware(request) {
  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Check for admin cookie
    const isAdminCookie = request.cookies.get('isAdmin')?.value

    if (isAdminCookie !== 'true') {
      // Redirect to admin login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/inventory/add/:path*',
    '/inventory/edit/:path*',
  ]
} 