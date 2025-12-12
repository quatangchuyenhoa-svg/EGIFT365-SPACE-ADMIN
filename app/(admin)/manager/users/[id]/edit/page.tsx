import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import CreateNewEditUser from "@/app/(admin)/manager/users/create-new-edit-user"
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

  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .single()

  return {
    title: data?.full_name ? `Edit ${data.full_name}` : "Edit user",
    description: data?.email ? `Edit user ${data.email}` : "Edit user",
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

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", id)
    .single()

  if (error || !data) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-destructive">
          Failed to load user: {error?.message || "User not found"}
        </p>
        <Link href={ROUTES.MANAGER.USERS} className="text-sm text-primary underline">
          Back to users
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <CreateNewEditUser
        mode="edit"
        userId={data.id}
        initialValues={{
          full_name: data.full_name,
          email: data.email,
          role: data.role,
        }}
      />
    </div>
  )
}

