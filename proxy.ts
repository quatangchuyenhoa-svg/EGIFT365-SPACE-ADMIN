import { type NextRequest, NextResponse } from "next/server"
import { ROUTES } from "@/lib/constants/routes"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow auth routes and API routes
  const isAuthRoute =
    pathname === ROUTES.AUTH.LOGIN ||
    pathname === ROUTES.AUTH.CALLBACK ||
    pathname.startsWith(`${ROUTES.AUTH.CALLBACK}/`)

  const isApiRoute = pathname.startsWith('/api/')

  if (isAuthRoute || isApiRoute) {
    return NextResponse.next({ request })
  }

  // Check refresh token cookie
  const adminRefreshToken = request.cookies.get('admin_refresh_token')
  if (!adminRefreshToken?.value) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}