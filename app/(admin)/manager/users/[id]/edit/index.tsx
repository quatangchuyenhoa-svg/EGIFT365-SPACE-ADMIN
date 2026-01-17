"use client"

import Link from "next/link"
import { useUserDetail } from "@/hooks/useUserDetail"
import CreateNewEditUser from "@/app/(admin)/manager/users/create-new-edit-user"
import { ROUTES } from "@/lib/constants/routes"
import type { Role } from "@/lib/constants/roles"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  userId: string
}

export default function EditUserClient({ userId }: Props) {
  const { data, isLoading, error } = useUserDetail(userId)

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-destructive">
          Failed to load user: {message}
        </p>
        <Link href={ROUTES.MANAGER.USERS} className="text-sm text-primary underline">
          Back to users
        </Link>
      </div>
    )
  }

  if (!data?.user) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-destructive">User not found</p>
        <Link href={ROUTES.MANAGER.USERS} className="text-sm text-primary underline">
          Back to users
        </Link>
      </div>
    )
  }

  const user = data.user

  return (
    <div className="p-6">
      <CreateNewEditUser
        mode="edit"
        userId={user.id}
        initialValues={{
          full_name: user.full_name,
          email: user.email || "",
          role: user.role ? (user.role as Role) : undefined,
        }}
      />
    </div>
  )
}

