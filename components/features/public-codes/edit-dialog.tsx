"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TokenForm } from "./token-form"

const PATH_PREFIX = "/egift365/"
const ALLOWED_APP_PATHS = ["concepts/", "knowledge/"]

type EditDialogProps = {
  token: { path: string; code: string; title?: string | null; category?: string | null } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (code: string, newPath: string, newTitle?: string, newCode?: string, newCategory?: string) => Promise<any>
  loading?: boolean
}

export function EditDialog({
  token,
  open,
  onOpenChange,
  onUpdate,
  loading,
}: EditDialogProps) {
  const [formPath, setFormPath] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formCode, setFormCode] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formErrors, setFormErrors] = useState<{ path?: string; title?: string; code?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  // Initialize state when modal opens
  useEffect(() => {
    if (open && token) {
      const displayPath = token.path.startsWith(PATH_PREFIX)
        ? token.path.substring(PATH_PREFIX.length)
        : token.path
      setFormPath(displayPath)
      setFormTitle(token.title || "")
      setFormCode(token.code)
      setFormCategory(token.category || "")
    } else {
      resetForm()
    }
  }, [open, token])

  const validateForm = (): boolean => {
    const errors: { path?: string; code?: string } = {}
    const trimmedPath = formPath.trim()

    if (!trimmedPath) {
      errors.path = "Path is required"
    } else if (!ALLOWED_APP_PATHS.some(sub => trimmedPath.startsWith(sub))) {
      errors.path = `Path must start with ${ALLOWED_APP_PATHS.join(" or ")}`
    }
    if (!formCode.trim()) {
      errors.code = "Code is required"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!token || !validateForm()) return
    setSubmitting(true)
    try {
      const fullPath = `${PATH_PREFIX}${formPath.trim().replace(/^\/+/, "")}`
      const newCode = formCode.trim() !== token.code ? formCode.trim() : undefined
      
      await onUpdate(
        token.code,
        fullPath,
        formTitle.trim() || undefined,
        newCode,
        formCategory.trim() || undefined
      )
      onOpenChange(false)
      resetForm()
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormPath("")
    setFormTitle("")
    setFormCode("")
    setFormCategory("")
    setFormErrors({})
  }

  const handleCancel = () => {
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) resetForm()
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Public Access Token</DialogTitle>
          <DialogDescription>
            Modify the content path or code for this token.
          </DialogDescription>
        </DialogHeader>
        <TokenForm
          formPath={formPath}
          formTitle={formTitle}
          formCode={formCode}
          formCategory={formCategory}
          formErrors={formErrors}
          onChangePath={setFormPath}
          onChangeTitle={setFormTitle}
          onChangeCode={setFormCode}
          onChangeCategory={setFormCategory}
          showPathHint
          showCodeHint
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || loading}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
