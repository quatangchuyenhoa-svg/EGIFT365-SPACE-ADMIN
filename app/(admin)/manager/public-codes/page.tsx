import { Metadata } from "next"
import PublicCodesClient from "./public-codes-client"
import { InfoCard } from "@/components/infoCard"

export const metadata: Metadata = {
  title: "Public Codes Manager",
  description: "Manage public access tokens for sharing content without login.",
}

export default function PublicCodesPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <InfoCard
        title="Public Codes Manager"
        description="Manage public access tokens. Create tokens to share content links that can be accessed without login."
        className="border-border/60 shadow-sm"
      />
      <PublicCodesClient />
    </div>
  )
}

