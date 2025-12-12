import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { ROUTES, getLoginUrlWithError } from "@/lib/constants/routes"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? ROUTES.HOME

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(new URL(getLoginUrlWithError(exchangeError.message), requestUrl.origin))
    }

    // Check user role in profile
    if (sessionData.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionData.user.id)
        .single()

      if (profileError || !profile) {
        // If profile doesn't exist, sign out and redirect to login
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL(getLoginUrlWithError("Profile not found. Please contact administrator."), requestUrl.origin))
      }

      // Check if role is "master"
      if (profile.role !== "master") {
        // Sign out user if role is not master
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL(getLoginUrlWithError("Access denied. Only master users can login."), requestUrl.origin))
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin))
}

