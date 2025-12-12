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

type EditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
  submitting: boolean
  loading: boolean
} & TokenFormProps

export function EditDialog({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  submitting,
  loading,
  ...formProps
}: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Public Access Token</DialogTitle>
          <DialogDescription>
            Update the path or code for this token.
          </DialogDescription>
        </DialogHeader>
        <TokenForm {...formProps} showPathHint showCodeHint />
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting || loading}>
            {submitting ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

