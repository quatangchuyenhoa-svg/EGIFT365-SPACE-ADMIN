"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dataTable"
import { type UserRow, useUsers } from "@/hooks/useUsers"
import { ROUTES } from "@/lib/constants/routes"
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react"

export default function UsersClient() {
  const { users, loading, error, refetch } = useUsers()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const columns: ColumnDef<UserRow>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      },
      {
        accessorKey: "full_name",
        header: "Full name",
        cell: ({ row }) => row.original.full_name || "—",
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => row.original.email || "—",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => row.original.role || "—",
      },
      {
        accessorKey: "created_at",
        header: "Created at",
        cell: ({ row }) =>
          row.original.created_at
            ? new Date(row.original.created_at).toLocaleString()
            : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original.id
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <IconDotsVertical className="size-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={ROUTES.MANAGER.USERS_EDIT(id)} className="flex items-center gap-2">
                    <IconPencil className="size-4" />
                    Edit
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={async () => {
                    if (!id) return
                    const ok = window.confirm("Delete this user?")
                    if (!ok) return
                    try {
                      setDeletingId(id)
                      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
                      const json = await res.json().catch(() => ({}))
                      if (!res.ok) {
                        throw new Error(json?.error || "Failed to delete user")
                      }
                      await refetch()
                    } catch (err) {
                      console.error(err)
                      alert(err instanceof Error ? err.message : "Failed to delete user")
                    } finally {
                      setDeletingId(null)
                    }
                  }}
                  disabled={deletingId === id}
                >
                  <IconTrash className="size-4" />
                  {deletingId === id ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [deletingId, refetch]
  )

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Failed to load users: {error}
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        filterKey="email"
        filterPlaceholder="Search by email"
        showAddButton={true}
        onAdd={() => router.push(ROUTES.MANAGER.USERS_CREATE)}
        showColumnCustomizer={true}
        showSearch={true}
        showPagination={true}
        selectable={false}
        draggable={false}
        meta={{}}
      />

      {loading && <p className="text-sm text-muted-foreground">Loading users...</p>}
    </div>
  )
}

