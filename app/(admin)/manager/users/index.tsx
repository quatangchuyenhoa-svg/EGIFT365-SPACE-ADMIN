"use client"

import { useMemo } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/dataTable"
import { type UserRow, useUsers } from "@/hooks/useUsers"

export default function UsersClient() {
  const { users, loading, error } = useUsers()

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
    ],
    []
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
        showAddButton={false}
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

