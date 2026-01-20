"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/dataTable"
import { usePublicAccessTokens } from "@/hooks/usePublicAccessTokens"
import { type PublicTokenRow } from "@/lib/services/public-tokens.services"
import { TokenActions } from "@/components/molecules/public-codes/TokenActions"
import { CreatedUrlDialog } from "@/components/molecules/public-codes/CreatedUrlDialog"
import { CreateDialog } from "@/components/molecules/public-codes/CreateDialog"
import { EditDialog } from "@/components/molecules/public-codes/EditDialog"
import { toast } from "react-hot-toast"

export default function PublicCodesClient() {
  const { tokens, loading, error, createToken, updateToken, deleteToken } =
    usePublicAccessTokens()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingToken, setEditingToken] = useState<PublicTokenRow | null>(null)
  const [createdToken, setCreatedToken] = useState<PublicTokenRow | null>(null)
  const [showCreatedUrl, setShowCreatedUrl] = useState(false)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // Form state
  const [formPath, setFormPath] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formCode, setFormCode] = useState("")
  const [formErrors, setFormErrors] = useState<{ path?: string; title?: string; code?: string }>({})

  //lấy base url của client
  const getBaseUrl = () => {
    if (typeof window === "undefined") return ""
    if (process.env.NEXT_PUBLIC_CLIENT_URL) return process.env.NEXT_PUBLIC_CLIENT_URL
    return window.location.origin.replace(/\/admin.*$/, "")
  }

  const baseUrl = getBaseUrl()

  //tạo code ngẫu nhiên(32 characters)
  const generateCode = () => {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    const code = Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("")
    setFormCode(code)
  }

  //validate form path và code
  const validateForm = (): boolean => {
    const errors: { path?: string; code?: string } = {}
    const trimmedPath = formPath.trim()
    if (!trimmedPath) {
      errors.path = "Path is required"
    } else if (!trimmedPath.startsWith("/egift365/concepts/")) {
      errors.path = "Path must start with /egift365/concepts/"
    }
    if (!formCode.trim()) {
      errors.code = "Code is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  //tạo token mới
  const handleCreate = async () => {
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const token = await createToken(formPath.trim(), formTitle.trim() || undefined, formCode.trim() || undefined)
      if (token) {
        setCreatedToken(token)
        setShowCreatedUrl(true)
        setIsCreateDialogOpen(false)
        resetForm()
      }
    } finally {
      setSubmitting(false)
    }
  }

  //sửa token
  const handleEdit = useCallback((token: PublicTokenRow) => {
    setEditingToken(token)
    setFormPath(token.path)
    setFormTitle(token.title || "")
    setFormCode(token.code)
    setIsEditDialogOpen(true)
  }, [])

  //cập nhật token
  const handleUpdate = async () => {
    if (!editingToken || !validateForm()) return
    setSubmitting(true)
    try {
      const newCode = formCode.trim() !== editingToken.code ? formCode.trim() : undefined
      await updateToken(editingToken.code, formPath.trim(), formTitle.trim() || undefined, newCode)
      setIsEditDialogOpen(false)
      resetForm()
      setEditingToken(null)
    } finally {
      setSubmitting(false)
    }
  }

  //xóa token
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

  //reset form
  const resetForm = () => {
    setFormPath("")
    setFormTitle("")
    setFormCode("")
    setFormErrors({})
  }

  //copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied link to clipboard")
  }

  //lấy full url của token
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

      {/* Create Dialog */}
      <CreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formPath={formPath}
        formTitle={formTitle}
        formCode={formCode}
        formErrors={formErrors}
        onChangePath={setFormPath}
        onChangeTitle={setFormTitle}
        onChangeCode={setFormCode}
        onGenerate={generateCode}
        onSubmit={handleCreate}
        onCancel={() => {
          setIsCreateDialogOpen(false)
          resetForm()
        }}
        submitting={submitting}
        loading={loading}
      />

      {/* Edit Dialog */}
      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formPath={formPath}
        formTitle={formTitle}
        formCode={formCode}
        formErrors={formErrors}
        onChangePath={setFormPath}
        onChangeTitle={setFormTitle}
        onChangeCode={setFormCode}
        onSubmit={handleUpdate}
        onCancel={() => {
          setIsEditDialogOpen(false)
          resetForm()
          setEditingToken(null)
        }}
        submitting={submitting}
        loading={loading}
      />

      <DataTable
        data={tokens.map(token => ({ ...token, id: token.code }))}
        columns={columns}
        filterKey="path"
        filterPlaceholder="Search by path, title, or code"
        showAddButton={true}
        onAdd={() => {
          resetForm()
          setIsCreateDialogOpen(true)
        }}
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
