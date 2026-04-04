"use client";

import { Users, Activity, QrCode, Trophy, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/api/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const { data: response, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card h-[132px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[150px] mt-2" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-[200px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 h-[280px]">
        <p className="text-destructive font-medium mb-4">Lỗi khi tải dữ liệu Dashboard</p>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 text-sm bg-background border px-4 py-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
        >
          <RefreshCw className="size-4" /> Thử lại
        </button>
      </div>
    );
  }

  const stats = response;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      
      {/* CArd 1: Total Users (Emerald Green) */}
      <Card className="@container/card group hover:shadow-md hover:border-emerald-500/30 transition-all cursor-default relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Users className="size-24 text-emerald-500" />
        </div>
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Users className="size-4" />
            </div>
            <CardDescription className="font-medium text-emerald-700 dark:text-emerald-400">
              Tổng Người Dùng
            </CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums text-foreground mt-1">
            {stats.users.total.toLocaleString()}
          </CardTitle>
          <CardAction>
            {/* Tạm ẩn trend vì chưa có backend, thiết kế UI trước */}
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 text-xs text-muted-foreground pt-4">
          Tổng số tài khoản trong hệ thống
        </CardFooter>
      </Card>

      {/* Card 2: Google Analytics (Blue/Indigo) */}
      <Card className="@container/card group hover:shadow-md hover:border-blue-500/30 transition-all cursor-default relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Activity className="size-24 text-blue-500" />
        </div>
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Activity className="size-4" />
            </div>
            <CardDescription className="font-medium text-blue-700 dark:text-blue-400">
              Traffic Tháng Này
            </CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums text-foreground mt-1">
            {stats.googleAnalytics.total_this_month.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800">
              Google Analytics
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 text-xs text-muted-foreground pt-4">
          Lượt xem trang thực tế theo GA4
        </CardFooter>
      </Card>

      {/* Card 3: QR Scans (Amber/Orange) */}
      <Card className="@container/card group hover:shadow-md hover:border-amber-500/30 transition-all cursor-default relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <QrCode className="size-24 text-amber-500" />
        </div>
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <QrCode className="size-4" />
            </div>
            <CardDescription className="font-medium text-amber-700 dark:text-amber-400">
              Lượt Quét QR
            </CardDescription>
          </div>
          <CardTitle className="text-3xl font-bold tabular-nums text-foreground mt-1">
            {stats.qrCodes.total_scans.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800">
              Toàn quyền hệ thống
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 text-xs text-muted-foreground pt-4">
          Tổng số lượt tải mã Code đã quét
        </CardFooter>
      </Card>

      {/* Card 4: Top Scan (Gold/Yellow) */}
      <Card className={`@container/card group hover:shadow-md transition-all relative overflow-hidden ${stats.topConcept ? 'hover:border-yellow-500/50 cursor-pointer' : 'cursor-default'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Trophy className="size-24 text-yellow-500" />
        </div>
        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
              <Trophy className="size-4" />
            </div>
            <CardDescription className="font-medium text-yellow-700 dark:text-yellow-400">
              Top QR Quét Nhiều Nhất
            </CardDescription>
          </div>
          {stats.topConcept ? (
            <CardTitle className="text-xl font-bold truncate text-foreground mt-2 max-w-[280px]" title={stats.topConcept.title || stats.topConcept.code}>
              {stats.topConcept.title || stats.topConcept.code}
            </CardTitle>
          ) : (
            <CardTitle className="text-xl font-bold text-muted-foreground mt-2">
              Chưa có dữ liệu
            </CardTitle>
          )}
          <CardAction>
            {stats.topConcept && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800 font-semibold px-2">
                {stats.topConcept.usage_count} views
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="relative z-10 text-xs text-muted-foreground pt-4 flex items-center justify-between">
          <span className="truncate">Đường dẫn: {stats.topConcept?.path || 'N/A'}</span>
          {stats.topConcept && (
            <span className="text-yellow-600 dark:text-yellow-400 font-medium whitespace-nowrap ml-2 group-hover:underline">Chi tiết &rarr;</span>
          )}
        </CardFooter>
        <a href={`/manager/public-codes`} className="absolute inset-0 z-20">
          <span className="sr-only">Xem chi tiết Public Codes</span>
        </a>
      </Card>
    </div>
  );
}
