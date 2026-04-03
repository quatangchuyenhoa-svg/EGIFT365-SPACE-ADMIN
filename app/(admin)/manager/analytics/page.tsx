import { Metadata } from "next"
import AnalyticsClient from "./analytics-client"
import { InfoCard } from "@/components/infoCard"

export const metadata: Metadata = {
  title: "Analytics Thống Kê",
  description: "Bảng theo dõi lượt xem chi tiết từ Google Analytics.",
}

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title="Thống kê truy cập"
        description="Theo dõi lưu lượng trực tiếp qua GA4 (Trang Chủ và Kho Quan Niệm)."
        className="border-border/60 shadow-sm"
      />
      <AnalyticsClient />
    </div>
  )
}
