"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TokenForm, type TokenFormProps } from "./TokenForm"

type CreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
  loading: boolean
} & TokenFormProps

export function CreateDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  submitting,
  loading,
  ...formProps
}: CreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Public Access Token</DialogTitle>
          <DialogDescription>
            Create a token to share content without requiring login.
          </DialogDescription>
        </DialogHeader>
        <TokenForm {...formProps} />
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting || loading}>
            {submitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

