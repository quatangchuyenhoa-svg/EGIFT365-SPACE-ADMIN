import { Metadata } from "next"
import UsersClient from "./users-client"
import { InfoCard } from "@/components/infoCard"
import { getTranslation } from "@/lib/i18n/server"

export const metadata: Metadata = {
  title: "Users manager",
  description: "View all users and their roles.",
}

export default async function UsersPage() {
  const { t } = await getTranslation()

  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title={t('users.manager_title')}
        description={t('users.manager_desc')}
        className="border-border/60 shadow-sm"
      />
      <UsersClient />
    </div>
  )
}