import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

/**
 * GET /api/public-tokens
 * Lấy danh sách tất cả tokens (admin only)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Kiểm tra authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kiểm tra role (chỉ master mới được xem)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "master") {
      return NextResponse.json(
        { error: "Forbidden - Master role required" },
        { status: 403 }
      );
    }

    // Lấy danh sách tokens
    const { data, error } = await supabase
      .from("public_access_tokens")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tokens:", error);
      return NextResponse.json(
        { error: "Failed to fetch tokens", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ tokens: data || [] });
  } catch (error) {
    console.error("Error in GET /api/public-tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/public-tokens
 * Tạo token mới
 * Body: { path: string, code?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Kiểm tra authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kiểm tra role (chỉ master mới được tạo)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "master") {
      return NextResponse.json(
        { error: "Forbidden - Master role required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { path, code } = body;

    // Validate
    if (!path || typeof path !== "string" || path.trim() === "") {
      return NextResponse.json(
        { error: "Path is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Generate code nếu không được cung cấp
    let finalCode = code;
    if (!finalCode || finalCode.trim() === "") {
      // Generate random code (32 characters)
      finalCode = randomBytes(16).toString("hex");
    }

    // Kiểm tra code đã tồn tại chưa
    const { data: existing } = await supabase
      .from("public_access_tokens")
      .select("code")
      .eq("code", finalCode)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 400 }
      );
    }

    // Tạo token mới
    const { data, error } = await supabase
      .from("public_access_tokens")
      .insert({
        code: finalCode,
        path: path.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating token:", error);
      return NextResponse.json(
        { error: "Failed to create token", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/public-tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

