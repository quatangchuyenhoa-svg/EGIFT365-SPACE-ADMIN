"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/shared/data-table"
import { usePublicAccessTokens } from "@/hooks/usePublicAccessTokens"
import { type PublicTokenRow } from "@/lib/services/public-tokens.services"
import { TokenActions } from "@/components/features/public-codes/token-actions"
import { CreatedUrlDialog } from "@/components/features/public-codes/created-url-dialog"
import { CreateDialog } from "@/components/features/public-codes/create-dialog"
import { EditDialog } from "@/components/features/public-codes/edit-dialog"
import { toast } from "react-hot-toast"

export default function PublicCodesClient() {
  const { tokens, loading, error, createToken, updateToken, deleteToken } =
    usePublicAccessTokens()
  
  // Modal states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingToken, setEditingToken] = useState<PublicTokenRow | null>(null)
  
  const [createdToken, setCreatedToken] = useState<PublicTokenRow | null>(null)
  const [showCreatedUrl, setShowCreatedUrl] = useState(false)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)

  // Show error toast when there's a global fetch error
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Get base url
  const getBaseUrl = () => {
    if (typeof window === "undefined") return ""
    if (process.env.NEXT_PUBLIC_CLIENT_URL) return process.env.NEXT_PUBLIC_CLIENT_URL
    return window.location.origin.replace(/\/admin.*$/, "")
  }

  const baseUrl = getBaseUrl()

  const handleEdit = useCallback((token: PublicTokenRow) => {
    setEditingToken(token)
  }, [])

  const handleDelete = useCallback(async (code: string) => {
    if (!window.confirm("Are you sure you want to delete this token? Links using this code will no longer work.")) {
      return
    }
    setDeletingCode(code)
    try {
      await deleteToken(code)
      toast.success("Token deleted successfully")
    } finally {
      setDeletingCode(null)
    }
  }, [deleteToken])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied link to clipboard")
  }

  const getFullUrl = useCallback((token: PublicTokenRow) => {
    return `${baseUrl}${token.path}?code=${token.code}`
  }, [baseUrl])

  type TokenWithId = PublicTokenRow & { id: string }

  const columns: ColumnDef<TokenWithId>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.title || "—"}</span>
        ),
      },
      {
        accessorKey: "path",
        header: "Path",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.path}</span>
        ),
      },
      {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.code}</span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) =>
          row.original.created_at
            ? new Date(row.original.created_at).toLocaleString()
            : "—",
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row }) =>
          row.original.updated_at
            ? new Date(row.original.updated_at).toLocaleString()
            : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TokenActions
            token={row.original as PublicTokenRow}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingCode={deletingCode}
            onCopy={(token) => copyToClipboard(getFullUrl(token))}
          />
        ),
      },
    ],
    [deletingCode, handleEdit, handleDelete, getFullUrl]
  )

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Failed to load tokens: {error}
        </div>
      )}

      <CreatedUrlDialog
        open={showCreatedUrl && !!createdToken}
        onOpenChange={setShowCreatedUrl}
        url={createdToken ? getFullUrl(createdToken) : ""}
        onCopy={copyToClipboard}
      />

      <CreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={createToken}
        onSuccess={(token) => {
          setCreatedToken(token)
          setShowCreatedUrl(true)
        }}
        loading={loading}
      />

      <EditDialog
        token={editingToken}
        open={!!editingToken}
        onOpenChange={(val) => {
            if (!val) setEditingToken(null)
        }}
        onUpdate={updateToken}
        loading={loading}
      />

      <DataTable
        data={tokens.map(token => ({ ...token, id: token.code }))}
        columns={columns}
        filterKey="path"
        filterPlaceholder="Search by path, title, or code"
        showAddButton={true}
        onAdd={() => setIsCreateDialogOpen(true)}
        addLabel="Create Token"
        showColumnCustomizer={true}
        showSearch={true}
        showPagination={true}
        selectable={false}
        draggable={false}
        meta={{}}
      />

      {loading && (
        <p className="text-sm text-muted-foreground">Loading tokens...</p>
      )}
    </div>
  )
}
