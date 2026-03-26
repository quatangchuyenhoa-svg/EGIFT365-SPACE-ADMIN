import { SectionCards } from "@/components/shared/section-cards"
import { ChartAreaInteractive } from "@/components/features/dashboard/chart-area-interactive"
import { DashboardArticles } from "@/components/features/dashboard/dashboard-articles"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:gap-6 lg:p-6 lg:pt-0">
      <SectionCards />
      <ChartAreaInteractive />
      <DashboardArticles />
    </div>
  )
}
