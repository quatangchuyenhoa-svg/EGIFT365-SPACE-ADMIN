import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { ROLES } from "@/lib/constants/roles"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message, users: [] },
        { status: 500 }
      )
    }

    return NextResponse.json({ users: data ?? [] }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: message, users: [] },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { full_name, email, role, password } = body || {}

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (role && !ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Use a supabase client that does NOT write auth cookies, to avoid overriding the current admin session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // no-op to prevent cookie overwrite
          },
        },
      }
    )

    // Sign up via public key (same as regular signup flow)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name?.trim() || null,
          role: role || "member",
        },
      },
    })

    if (signUpError || !signUpData?.user?.id) {
      return NextResponse.json(
        { error: signUpError?.message || "Failed to sign up user" },
        { status: 500 }
      )
    }

    // Insert/update profile (trigger may have already inserted a row)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: signUpData.user.id,
          full_name: full_name?.trim() || null,
          email,
          role: role || "member",
        },
        { onConflict: "id" }
      )
      .select("id, full_name, email, role, created_at")
      .single()

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ user: profile }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

