import { Metadata } from "next"
import PublicCodesClient from "./public-codes-client"
import { InfoCard } from "@/components/infoCard"
import { getTranslation } from "@/lib/i18n/server"

export const metadata: Metadata = {
  title: "Public Codes Manager",
  description: "Manage public access tokens for sharing content without login.",
}

export default async function PublicCodesPage() {
  const { t } = await getTranslation()

  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title={t('public_codes.manager_title')}
        description={t('public_codes.manager_desc')}
        className="border-border/60 shadow-sm"
      />
      <PublicCodesClient />
    </div>
  )
}

