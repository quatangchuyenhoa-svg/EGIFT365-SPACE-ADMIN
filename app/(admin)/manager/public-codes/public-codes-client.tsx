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
import { useTranslation } from "@/lib/i18n/client"

const PATH_PREFIX = "/egift365/"
const ALLOWED_APP_PATHS = ["concepts/", "knowledge/"]

export default function PublicCodesClient() {
  const { t } = useTranslation()
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
      toast.error(t('public_codes.load_error'))
    }
  }, [error, t])

  // Form state
  const [formPath, setFormPath] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formCode, setFormCode] = useState("")
  const [formCategory, setFormCategory] = useState("")
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
      errors.path = t('public_codes.form.path_required')
    } else if (!ALLOWED_APP_PATHS.some(sub => trimmedPath.startsWith(sub))) {
      errors.path = t('public_codes.form.path_invalid')
    }
    if (!formCode.trim()) {
      errors.code = t('public_codes.form.code_required')
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  //tạo token mới
  const handleCreate = async () => {
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const fullPath = `${PATH_PREFIX}${formPath.trim().replace(/^\/+/, "")}`
      const token = await createToken(
        fullPath,
        formTitle.trim() || undefined,
        formCode.trim() || undefined,
        formCategory.trim() || undefined
      )
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
    // Strip prefix for editing
    const displayPath = token.path.startsWith(PATH_PREFIX)
      ? token.path.substring(PATH_PREFIX.length)
      : token.path
    setFormPath(displayPath)
    setFormTitle(token.title || "")
    setFormCode(token.code)
    setFormCategory(token.category || "")
    setIsEditDialogOpen(true)
  }, [])

  //cập nhật token
  const handleUpdate = async () => {
    if (!editingToken || !validateForm()) return
    setSubmitting(true)
    try {
      const fullPath = `${PATH_PREFIX}${formPath.trim().replace(/^\/+/, "")}`
      const newCode = formCode.trim() !== editingToken.code ? formCode.trim() : undefined
      await updateToken(
        editingToken.code,
        fullPath,
        formTitle.trim() || undefined,
        newCode,
        formCategory.trim() || undefined
      )
      setIsEditDialogOpen(false)
      resetForm()
      setEditingToken(null)
    } finally {
      setSubmitting(false)
    }
  }

  //xóa token
  const handleDelete = useCallback(async (code: string) => {
    if (!window.confirm(t('public_codes.delete_confirm_desc'))) {
      return
    }
    setDeletingCode(code)
    try {
      await deleteToken(code)
      toast.success(t('public_codes.delete_success'))
    } finally {
      setDeletingCode(null)
    }
  }, [deleteToken, t])

  //reset form
  const resetForm = () => {
    setFormPath("")
    setFormTitle("")
    setFormCode("")
    setFormCategory("")
    setFormErrors({})
  }

  //copy to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('public_codes.copy_success'))
  }, [t])

  //lấy full url của token
  const getFullUrl = useCallback((token: PublicTokenRow) => {
    return `${baseUrl}${token.path}?code=${token.code}`
  }, [baseUrl])

  type TokenWithId = PublicTokenRow & { id: string }

  const columns: ColumnDef<TokenWithId>[] = useMemo(
    () => [
      {
        accessorKey: "title",
        header: t('common.title'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.title || "—"}</span>
        ),
      },
      {
        accessorKey: "category",
        header: t('common.category'),
        cell: ({ row }) => (
          <span className="text-sm bg-secondary px-2 py-0.5 rounded text-secondary-foreground whitespace-nowrap">
            {row.original.category || "—"}
          </span>
        ),
      },
      {
        accessorKey: "path",
        header: t('common.path'),
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.path}</span>
        ),
      },
      {
        accessorKey: "code",
        header: t('common.code'),
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.code}</span>
        ),
      },
      {
        accessorKey: "usage_count",
        header: t('public_codes.usage'),
        cell: ({ row }) => {
          const count = row.original.usage_count || 0;
          return (
            <span className="inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
              {count} {count <= 1 ? t('dashboard.views', { count: 1 }) : t('dashboard.views', { count })}
            </span>
          );
        },
      },
      {
        accessorKey: "last_accessed_at",
        header: t('public_codes.last_used'),
        cell: ({ row }) => {
          if (!row.original.last_accessed_at) return <span className="text-muted-foreground text-xs">—</span>;
          try {
            const date = new Date(row.original.last_accessed_at);
            return <span className="text-xs">{date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>;
          } catch {
            return "—";
          }
        },
      },
      {
        accessorKey: "created_at",
        header: t('common.created_at'),
        cell: ({ row }) =>
          row.original.created_at
            ? new Date(row.original.created_at).toLocaleString()
            : "—",
      },
      {
        accessorKey: "updated_at",
        header: t('common.updated_at'),
        cell: ({ row }) =>
          row.original.updated_at
            ? new Date(row.original.updated_at).toLocaleString()
            : "—",
      },
      {
        id: "actions",
        header: t('common.actions'),
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
    [deletingCode, handleEdit, handleDelete, getFullUrl, copyToClipboard, t]
  )

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {t('public_codes.load_error')}: {error}
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
        formCategory={formCategory}
        onChangeCategory={setFormCategory}
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
        formCategory={formCategory}
        onChangeCategory={setFormCategory}
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
        filterPlaceholder={t('public_codes.search_placeholder')}
        showAddButton={true}
        onAdd={() => {
          resetForm()
          setIsCreateDialogOpen(true)
        }}
        addLabel={t('public_codes.create_token')}
        showColumnCustomizer={true}
        showSearch={true}
        showPagination={true}
        selectable={false}
        draggable={false}
        meta={{}}
      />

      {loading && (
        <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
      )}
    </div>
  )
}
