"use client";

import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DashboardArticles } from "@/components/dashboard-articles"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { syncAnalyticsService } from "@/lib/services/dashboard.services"
import { useState } from "react"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/client"

export default function Home() {
  const { t } = useTranslation('common');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAnalyticsService();
      toast.success(t('dashboard.sync_success'));
      window.location.reload();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(t('dashboard.sync_error'));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 lg:gap-6 lg:p-6 lg:pt-0">
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold tracking-tight" suppressHydrationWarning>
          {t('dashboard.title')}
        </h1>
        <Button 
          onClick={handleSync} 
          disabled={isSyncing}
          variant="outline"
          className="flex items-center gap-2"
          suppressHydrationWarning
        >
          <RefreshCw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? t('dashboard.syncing') : t('dashboard.sync_button')}
        </Button>
      </div>

      <SectionCards />
      <ChartAreaInteractive />
      <DashboardArticles />
    </div>
  )
}
