"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { DashboardArticles } from "@/components/dashboard-articles"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { syncAnalyticsService } from "@/lib/services/dashboard.services"
import { useState } from "react"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/client"

export default function Page() {
  const { t } = useTranslation('common');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAnalyticsService();
      toast.success(t('dashboard.sync_success', { defaultValue: 'Cập nhật dữ liệu Analytics thành công!' }));
      // Reload page or refresh data
      window.location.reload();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(t('dashboard.sync_error', { defaultValue: 'Lỗi khi cập nhật dữ liệu Analytics' }));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <h1 className="text-2xl font-bold tracking-tight">{t('dashboard.title', { defaultValue: 'Dashboard' })}</h1>
          <Button 
            onClick={handleSync} 
            disabled={isSyncing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? t('dashboard.syncing') : t('dashboard.sync_button')}
          </Button>
        </div>
        
        <SectionCards />
        
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DashboardArticles />
      </div>
    </div>
  )
}
