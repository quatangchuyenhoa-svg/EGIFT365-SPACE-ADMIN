"use client"

import { useState } from "react"
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
import { generateRandomHexStr } from "@/lib/utils"

const PATH_PREFIX = "/egift365/"
const ALLOWED_APP_PATHS = ["concepts/", "knowledge/"]

type CreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (path: string, title?: string, code?: string) => Promise<any>
  onSuccess: (token: any) => void
  loading?: boolean
}

export function CreateDialog({
  open,
  onOpenChange,
  onCreate,
  onSuccess,
  loading,
}: CreateDialogProps) {
  const [formPath, setFormPath] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formCode, setFormCode] = useState("")
  const [formErrors, setFormErrors] = useState<{ path?: string; title?: string; code?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const generateCode = () => {
    setFormCode(generateRandomHexStr(16))
  }

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
    if (!validateForm()) return
    setSubmitting(true)
    try {
      const fullPath = `${PATH_PREFIX}${formPath.trim().replace(/^\/+/, "")}`
      const token = await onCreate(
        fullPath,
        formTitle.trim() || undefined,
        formCode.trim() || undefined
      )
      if (token) {
        onSuccess(token)
        onOpenChange(false)
        resetForm()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormPath("")
    setFormTitle("")
    setFormCode("")
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
          <DialogTitle>Create Public Access Token</DialogTitle>
          <DialogDescription>
            Create a token to share content without requiring login.
          </DialogDescription>
        </DialogHeader>
        <TokenForm
          formPath={formPath}
          formTitle={formTitle}
          formCode={formCode}
          formErrors={formErrors}
          onChangePath={setFormPath}
          onChangeTitle={setFormTitle}
          onChangeCode={setFormCode}
          onGenerate={generateCode}
        />
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || loading}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
