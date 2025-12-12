import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * DELETE /api/public-tokens/[code]
 * Xóa token
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createClient();
    
    // Kiểm tra authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kiểm tra role (chỉ master mới được xóa)
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

    // Xóa token
    const { error } = await supabase
      .from("public_access_tokens")
      .delete()
      .eq("code", code);

    if (error) {
      console.error("Error deleting token:", error);
      return NextResponse.json(
        { error: "Failed to delete token", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/public-tokens/[code]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/public-tokens/[code]
 * Cập nhật token (path hoặc code)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createClient();
    
    // Kiểm tra authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Kiểm tra role (chỉ master mới được cập nhật)
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
    const { path, newCode } = body;

    // Validate
    if (!path || typeof path !== "string" || path.trim() === "") {
      return NextResponse.json(
        { error: "Path is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Nếu có newCode, kiểm tra code mới đã tồn tại chưa (nếu khác code hiện tại)
    if (newCode && newCode !== code) {
      const { data: existing } = await supabase
        .from("public_access_tokens")
        .select("code")
        .eq("code", newCode)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: "New code already exists" },
          { status: 400 }
        );
      }
    }

    // Nếu code đã thay đổi, cần xóa record cũ và tạo record mới
    // (vì code là primary key, không thể update trực tiếp)
    if (newCode && newCode !== code) {
      // Xóa record cũ
      const { error: deleteError } = await supabase
        .from("public_access_tokens")
        .delete()
        .eq("code", code);

      if (deleteError) {
        console.error("Error deleting old token:", deleteError);
        return NextResponse.json(
          { error: "Failed to update token code", details: deleteError.message },
          { status: 500 }
        );
      }

      // Tạo record mới với code mới
      const { data: newData, error: insertError } = await supabase
        .from("public_access_tokens")
        .insert({
          code: newCode,
          path: path.trim(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating new token:", insertError);
        return NextResponse.json(
          { error: "Failed to update token code", details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ token: newData });
    }

    // Cập nhật token (chỉ path)
    const { data, error } = await supabase
      .from("public_access_tokens")
      .update({ path: path.trim() })
      .eq("code", code)
      .select()
      .single();

    if (error) {
      console.error("Error updating token:", error);
      return NextResponse.json(
        { error: "Failed to update token", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: data });
  } catch (error) {
    console.error("Error in PUT /api/public-tokens/[code]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

