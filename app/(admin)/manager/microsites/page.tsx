import { Metadata } from "next";
import MicrositesClient from "./microsites-client";
import { InfoCard } from "@/components/infoCard";

export const metadata: Metadata = {
  title: "School Microsites Manager",
  description: "Manage school memory pass spaces and student records.",
};

export default async function MicrositesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title="Quản lý School Microsites"
        description="Danh sách các lớp học và trường học đang sở hữu không gian kỷ niệm số. Nhấp vào trường để quản lý danh sách học sinh."
        className="border-border/60 shadow-sm"
      />
      <MicrositesClient />
    </div>
  );
}
