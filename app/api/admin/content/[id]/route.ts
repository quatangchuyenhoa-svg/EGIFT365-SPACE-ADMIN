import { NextRequest, NextResponse } from "next/server";
import { serverClient } from "@/sanity/server-client";

/**
 * DELETE article by ID from Sanity
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Missing document ID" },
                { status: 400 }
            );
        }

        // Delete document from Sanity
        await serverClient.delete(id);

        return NextResponse.json({
            success: true,
            message: "Bài viết đã được xóa thành công",
        });
    } catch (error) {
        console.error("Delete content error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xóa bài viết",
            },
            { status: 500 }
        );
    }
}

/**
 * GET article status or detail if needed (optional)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const document = await serverClient.getDocument(id);

        if (!document) {
            return NextResponse.json(
                { success: false, message: "Document not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: document });
    } catch {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
