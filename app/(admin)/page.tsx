import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DashboardArticles } from "@/components/dashboard-articles"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:gap-6 lg:p-6 lg:pt-0">
      <SectionCards />
      <ChartAreaInteractive />
      <DashboardArticles />
    </div>
  )
}
