
"use client"

import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/dataTable"
import { type AnalyticsRow, useAnalytics } from "@/hooks/useAnalytics"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconEye } from "@tabler/icons-react"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function AnalyticsClient() {
  const [dateRange, setDateRange] = useState("30daysAgo")
  const [type, setType] = useState<"concepts" | "home">("concepts")

  const { data, loading, error, refetch } = useAnalytics(dateRange, type)

  const columns: ColumnDef<AnalyticsRow>[] = useMemo(
    () => [
      {
        id: "rank",
        header: "Rank",
        cell: ({ row }) => {
          const index = row.index;
          if (index === 0) return <Badge className="bg-amber-500 hover:bg-amber-600">#1</Badge>;
          if (index === 1) return <Badge variant="secondary" className="bg-zinc-300 text-zinc-800 hover:bg-zinc-400">#2</Badge>;
          if (index === 2) return <Badge variant="secondary" className="bg-orange-300 text-orange-900 hover:bg-orange-400">#3</Badge>;
          return <span className="text-muted-foreground ml-2">#{index + 1}</span>;
        },
      },
      {
        accessorKey: "title",
        header: "Article Title",
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">{row.original.title || 'No title'}</div>
              <div className="text-xs text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded inline-block mt-1">
                {row.original.path}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => <span className="font-semibold text-emerald-600">{row.original.views.toLocaleString('en-US')}</span>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://space.egift365.vn'
          return (
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`${clientUrl}${row.original.path}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View actual page"
              >
                <IconEye className="size-4 text-muted-foreground" />
              </Link>
            </Button>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 flex items-start gap-3 rounded-md border border-destructive/20">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-medium">Analytics Connection Error</h3>
            <p className="text-sm opacity-90">{error}</p>
            <p className="text-sm opacity-70 border-t border-destructive/20 pt-2 mt-2">
              Please ensure you have configured GA4 (Property ID, Email, Private Key) in the Admin `.env` and enabled the Data API.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs defaultValue="concepts" value={type} onValueChange={(v) => setType(v as 'concepts' | 'home')} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="concepts">Concepts Library</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7daysAgo">Last 7 days</SelectItem>
              <SelectItem value="30daysAgo">Last 30 days</SelectItem>
              <SelectItem value="90daysAgo">Last 90 days</SelectItem>
              <SelectItem value="2020-01-01">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        filterKey="title"
        filterPlaceholder="Search by title..."
        showSearch={true}
        showPagination={true}
        selectable={false}
        draggable={false}
        meta={{}}
      />

      {loading && <p className="text-sm text-muted-foreground animate-pulse mt-2">Loading data from Google Analytics...</p>}
    </div>
  )
}
