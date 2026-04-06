import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DashboardArticles } from "@/components/dashboard-articles"
import { getTranslation } from "@/lib/i18n/server"

export default async function Home() {
  const { i18n } = await getTranslation()
  const lng = i18n.language

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:gap-6 lg:p-6 lg:pt-0">
      <SectionCards />
      <ChartAreaInteractive />
      <DashboardArticles lng={lng} />
    </div>
  )
}
