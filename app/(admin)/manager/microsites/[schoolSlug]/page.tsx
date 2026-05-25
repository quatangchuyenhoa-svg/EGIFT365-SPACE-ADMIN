import { Metadata } from "next";
import SchoolDetailClient from "./school-detail-client";
import { InfoCard } from "@/components/infoCard";

export const metadata: Metadata = {
  title: "School Microsite Details",
  description: "Manage student accounts and customized memory passes.",
};

interface PageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

const SCHOOL_NAME_MAP: Record<string, string> = {
  nguyenbinhkhiem: "Nguyễn Bỉnh Khiêm",
  newton: "Newton",
  banmai: "Ban Mai",
};

export default async function SchoolSlugPage({ params }: PageProps) {
  const { schoolSlug } = await params;
  const schoolName = SCHOOL_NAME_MAP[schoolSlug] || schoolSlug;

  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title={`Quản lý không gian · THPT ${schoolName}`}
        description={`Xem, thêm mới, cập nhật và xóa danh sách tài khoản học sinh thuộc trường THPT ${schoolName}.`}
        className="border-border/60 shadow-sm"
      />
      <SchoolDetailClient schoolSlug={schoolSlug} />
    </div>
  );
}
