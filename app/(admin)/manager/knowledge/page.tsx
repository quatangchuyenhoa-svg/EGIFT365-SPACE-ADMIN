import { Metadata } from "next";
import KnowledgeClient from "@/app/(admin)/manager/knowledge/knowledge-client";
import { InfoCard } from "@/components/infoCard";

export const metadata: Metadata = {
    title: "Quản lý Kho Tri Thức",
    description: "Danh sách bài viết trong Kho Tri Thức",
};

export default function KnowledgePage() {
    return (
        <div className="flex flex-col gap-4 p-6">
            <InfoCard
                title="Kho Tri Thức"
                description="Quản lý các bài viết tri thức. Bạn có thể xóa bài viết trực tiếp tại đây hoặc chỉnh sửa trong Studio."
                className="border-border/60 shadow-sm"
            />
            <KnowledgeClient />
        </div>
    );
}
