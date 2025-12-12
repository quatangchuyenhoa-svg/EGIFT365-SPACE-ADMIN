import { Metadata } from "next"
import UsersClient from "./users-client"
import { InfoCard } from "@/components/infoCard"

export const metadata: Metadata = {
  title: "Users manager",
  description: "View all users and their roles.",
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title="Users manager"
        description="View all users and their roles."
        className="border-border/60 shadow-sm"
      />
      <UsersClient />
    </div>
  )
}