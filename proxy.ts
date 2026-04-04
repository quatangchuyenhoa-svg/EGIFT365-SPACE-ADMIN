import { type NextRequest, NextResponse } from "next/server"
import { ROUTES } from "@/lib/constants/routes"
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from '@/lib/i18n/settings'

acceptLanguage.languages(languages)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. I18n Locale Detection
  let lng: string | undefined | null
  if (request.cookies.has(cookieName)) {
    lng = acceptLanguage.get(request.cookies.get(cookieName)?.value)
  }
  if (!lng) {
    lng = acceptLanguage.get(request.headers.get('Accept-Language'))
  }
  if (!lng) {
    lng = fallbackLng
  }

  // 2. Auth Logic
  const isAuthRoute =
    pathname === ROUTES.AUTH.LOGIN ||
    pathname === ROUTES.AUTH.CALLBACK ||
    pathname.startsWith(`${ROUTES.AUTH.CALLBACK}/`)

  const isApiRoute = pathname.startsWith('/api/')

  // Prepare headers for the next request step (Server Components)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', lng!)

  const setI18nResponse = (res: NextResponse) => {
    res.headers.set('x-locale', lng!)
    if (!request.cookies.has(cookieName)) {
      res.cookies.set(cookieName, lng!)
    }
    return res
  }

  if (isAuthRoute || isApiRoute) {
    const res = NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
    return setI18nResponse(res)
  }

  // Check refresh token cookie
  const adminRefreshToken = request.cookies.get('admin_refresh_token')
  if (!adminRefreshToken?.value) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url)
    loginUrl.searchParams.set('next', pathname)
    const res = NextResponse.redirect(loginUrl)
    return setI18nResponse(res)
  }

  const res = NextResponse.next({
    request: {
        headers: requestHeaders,
    }
  })
  return setI18nResponse(res)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|locales|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}