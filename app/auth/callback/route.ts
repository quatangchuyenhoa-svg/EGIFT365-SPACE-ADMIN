/**
 * OAuth callback route - DISABLED
 * OAuth authentication is not yet implemented in NestJS backend
 * 
 * This route redirects to login with an error message
 */
import { NextResponse } from "next/server"
import { getLoginUrlWithError } from "@/lib/constants/routes"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  // OAuth is not supported - redirect to login
  return NextResponse.redirect(
    new URL(
      getLoginUrlWithError("OAuth authentication is not yet supported. Please use email/password login."),
      requestUrl.origin
    )
  )
}

