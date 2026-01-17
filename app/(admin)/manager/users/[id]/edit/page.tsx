/**
 * Edit user page (Client-side)
 * Loads user data from NestJS backend using React Query
 */
import { Metadata } from "next"
import Link from "next/link"
import EditUserClient from "./"
import { ROUTES } from "@/lib/constants/routes"

type PageParams = Promise<{ id: string }>

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { id } = await params

  if (!id || id === "undefined") {
    return {
      title: "Edit user",
      description: "Edit user",
    }
  }

  return {
    title: "Edit user",
    description: "Edit user",
  }
}

export default async function EditUserPage({
  params,
}: {
  params: PageParams
}) {
  const { id } = await params

  if (!id || id === "undefined") {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-destructive">Invalid user id</p>
        <Link href={ROUTES.MANAGER.USERS} className="text-sm text-primary underline">
          Back to users
        </Link>
      </div>
    )
  }

  return <EditUserClient userId={id} />
}

