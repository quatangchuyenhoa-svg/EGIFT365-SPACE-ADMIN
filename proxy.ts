import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { updateSession } from "@/lib/supabase/proxy"
import { ROUTES, getLoginUrlWithError } from "@/lib/constants/routes"

type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: "strict" | "lax" | "none" | boolean
  secure?: boolean
}

function createSupabaseClient(
  request: NextRequest,
  response: NextResponse,
  onSetCookie?: (cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) => void
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          if (onSetCookie) {
            onSetCookie(cookiesToSet)
          } else {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          }
        },
      },
    }
  )
}

async function getUserWithRole(request: NextRequest, response?: NextResponse) {
  const supabase = createSupabaseClient(
    request,
    response ?? NextResponse.next({ request }),
    () => {}
  )

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (!user || userError) {
    return { user: null, role: null }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return { user, role: null }
  }

  return { user, role: profile.role }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow auth routes
  const isAuthRoute =
    pathname === ROUTES.AUTH.LOGIN ||
    pathname === ROUTES.AUTH.SIGNUP ||
    pathname === ROUTES.AUTH.CALLBACK ||
    pathname.startsWith(`${ROUTES.AUTH.CALLBACK}/`)

  if (isAuthRoute) {
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
  
  /* DISABLED - Supabase code below
  const { pathname } = request.nextUrl

  // Allow well-known endpoints (e.g., Chrome devtools)
  if (pathname.startsWith("/.well-known")) {
    return NextResponse.next({ request })
  }

  // Allow auth callback to proceed (handled in route)
  if (pathname === ROUTES.AUTH.CALLBACK || pathname.startsWith(`${ROUTES.AUTH.CALLBACK}/`)) {
    return await updateSession(request)
  }

  const isAuthRoute = pathname === ROUTES.AUTH.LOGIN || pathname === ROUTES.AUTH.SIGNUP

  // Auth routes: if already authenticated, sign out to avoid stale session
  if (isAuthRoute) {
    const response = await updateSession(request)
    const { user } = await getUserWithRole(request, response)

    if (user) {
      const logoutResponse = NextResponse.next({ request })
      const logoutClient = createSupabaseClient(request, logoutResponse, (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          logoutResponse.cookies.set(name, value, options)
        })
      })

      await logoutClient.auth.signOut()
      return logoutResponse
    }

    return response
  }

  // Protected routes: require authenticated master role
  const response = await updateSession(request)
  const { user, role } = await getUserWithRole(request, response)

  if (!user) {
    const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (role !== "master") {
    const loginUrl = new URL(getLoginUrlWithError("Access denied. Only master users can login."), request.url)
    const logoutResponse = NextResponse.redirect(loginUrl)
    const logoutClient = createSupabaseClient(request, logoutResponse, (cookiesToSet) => {
      cookiesToSet.forEach(({ name, value, options }) => {
        request.cookies.set(name, value)
        logoutResponse.cookies.set(name, value, options)
      })
    })

    await logoutClient.auth.signOut()
    return logoutResponse
  }

  return response
  */
}

// Temporarily disabled - migrating from Supabase to NestJS auth
// TODO: Update to use JWT from NestJS backend
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}