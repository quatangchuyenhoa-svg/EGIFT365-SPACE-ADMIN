import { Metadata } from "next"
import CreateNewEditUser from "@/app/(admin)/manager/users/create-new-edit-user"

export const metadata: Metadata = {
  title: "Create user",
  description: "Create a new user",
}

export default function CreateUserPage() {
  return (
    <div className="p-6">
      <CreateNewEditUser mode="create" />
    </div>
  )
}

