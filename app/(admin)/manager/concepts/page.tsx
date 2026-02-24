import { Metadata } from "next";
import ConceptsClient from "@/app/(admin)/manager/concepts/concepts-client";
import { InfoCard } from "@/components/infoCard";

export const metadata: Metadata = {
    title: "Quản lý Kho Quan Niệm",
    description: "Danh sách bài viết trong Kho Quan Niệm",
};

export default function ConceptsPage() {
    return (
        <div className="flex flex-col gap-4 p-6">
            <InfoCard
                title="Kho Quan Niệm"
                description="Quản lý các bài viết quan niệm. Bạn có thể xóa bài viết trực tiếp tại đây hoặc chỉnh sửa trong Studio."
                className="border-border/60 shadow-sm"
            />
            <ConceptsClient />
        </div>
    );
}
