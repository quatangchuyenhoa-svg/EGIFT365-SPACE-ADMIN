import { AdminLayout } from "@/components/admin-layout"
import { getTranslation } from "@/lib/i18n/server"

export default async function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { i18n, resources } = await getTranslation()
  const lng = i18n.language

  return <AdminLayout lng={lng} resources={resources}>{children}</AdminLayout>
}

