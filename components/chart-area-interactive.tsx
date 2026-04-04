"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { useDashboardStats } from "@/hooks/api/useDashboardStats"
import { useTranslation } from "@/lib/i18n/client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"

export const description = "An interactive area chart"

export function ChartAreaInteractive() {
  const { t, i18n } = useTranslation('dashboard')
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("7d")
  const { data: stats, isLoading, isError } = useDashboardStats()

  const chartConfig = {
    views: {
      label: t('views'),
    },
    home: {
      label: t('sidebar.dashboard', { ns: 'common' }),
      color: "var(--chart-1)",
    },
    concepts: {
      label: "Concepts",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />
  }

  if (isError || !stats) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center text-muted-foreground p-6 text-center">
        {t('error_loading')}
      </Card>
    )
  }

  const rawData = stats.chartData || []

  // Ensure referenceDate is today so we calculate days properly
  const referenceDate = new Date()
  referenceDate.setHours(23, 59, 59, 999)

  const filteredData = rawData.filter((item) => {
    const date = new Date(item.date)
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    // reset time for proper comparison
    startDate.setHours(0, 0, 0, 0)
    return date >= startDate
  })

  // Format date for X-Axis to DD/MM or MM/DD based on locale
  const formatXAxisDate = (value: string) => {
    const date = new Date(value)
    return date.toLocaleDateString(i18n.resolvedLanguage === 'vi' ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit"
    })
  }

  // Format tooltip to full date
  const formatTooltipDate = (value: string) => {
    const date = new Date(value)
    return date.toLocaleDateString(i18n.resolvedLanguage === 'vi' ? "vi-VN" : "en-US", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t('online_traffic')}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {t('ga4_total_views_desc')}
          </span>
          <span className="@[540px]/card:hidden">{t('ga4_views')}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d">{t('time_range.7d')}</ToggleGroupItem>
            <ToggleGroupItem value="30d">{t('time_range.30d')}</ToggleGroupItem>
            <ToggleGroupItem value="90d">{t('time_range.90d')}</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder={t('time_range.7d')} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                {t('time_range.7d')}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t('time_range.30d')}
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                {t('time_range.90d')}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillHome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-home)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-home)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillConcepts" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-concepts)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-concepts)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatXAxisDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={formatTooltipDate}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="concepts"
              type="natural"
              fill="url(#fillConcepts)"
              stroke="var(--color-concepts)"
              stackId="a"
            />
            <Area
              dataKey="home"
              type="natural"
              fill="url(#fillHome)"
              stroke="var(--color-home)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
