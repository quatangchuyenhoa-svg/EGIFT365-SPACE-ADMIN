"use client"

import * as React from "react"
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
import { useDeleteUser } from "@/hooks/useDeleteUser"
import { ROUTES } from "@/lib/constants/routes"
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTranslation } from "@/lib/i18n/client"

export default function UsersClient() {
  const { t } = useTranslation()
  const [mounted, setMounted] = React.useState(false)
  const { users, loading, error, refetch } = useUsers()
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const deleteMutation = useDeleteUser({
    onSuccess: async () => {
      await refetch()
    },
  })

  const columns: ColumnDef<UserRow>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      },
      {
        accessorKey: "full_name",
        header: t('users.full_name'),
        cell: ({ row }) => row.original.full_name || "—",
      },
      {
        accessorKey: "email",
        header: t('users.email'),
        cell: ({ row }) => row.original.email || "—",
      },
      {
        accessorKey: "role",
        header: t('users.role'),
        cell: ({ row }) => row.original.role || "—",
      },
      {
        accessorKey: "created_at",
        header: t('common.created_at'),
        cell: ({ row }) => {
          if (!mounted || !row.original.created_at) return "—"
          return new Date(row.original.created_at).toLocaleString()
        },
      },
      {
        id: "actions",
        header: t('common.actions'),
        cell: ({ row }) => {
          const user = row.original
          const isDeleting = deleteMutation.isPending && selectedUser?.id === user.id

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <IconDotsVertical className="size-4" />
                  <span className="sr-only">{t('common.actions')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={ROUTES.MANAGER.USERS_EDIT(user.id)} className="flex items-center gap-2">
                    <IconPencil className="size-4" />
                    {t('common.edit')}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setSelectedUser(user)}
                  disabled={isDeleting}
                >
                  <IconTrash className="size-4" />
                  {isDeleting ? t('common.deleting') : t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [deleteMutation.isPending, selectedUser, t, mounted]
  )

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {t('users.load_error')}: {error}
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        filterKey="email"
        filterPlaceholder={t('users.search_placeholder')}
        showAddButton={true}
        onAdd={() => router.push(ROUTES.MANAGER.USERS_CREATE)}
        showColumnCustomizer={true}
        showSearch={true}
        showPagination={true}
        selectable={false}
        draggable={false}
        meta={{}}
      />

      {loading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setSelectedUser(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser
                ? t('users.delete_confirm_desc', { name: selectedUser.email || selectedUser.id })
                : t('users.delete_confirm_desc', { name: 'this user' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending || !selectedUser}
              onClick={() => {
                if (!selectedUser) return
                deleteMutation.mutate(selectedUser.id, {
                  onSettled: () => {
                    setSelectedUser(null)
                  },
                })
              }}
            >
              {deleteMutation.isPending ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

