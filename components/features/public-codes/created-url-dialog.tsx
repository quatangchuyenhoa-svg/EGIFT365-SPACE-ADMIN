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
import { Input } from "@/components/ui/input"
import { IconCopy } from "@tabler/icons-react"

type CreatedUrlDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  onCopy: (text: string) => void
}

export function CreatedUrlDialog({
  open,
  onOpenChange,
  url,
  onCopy,
}: CreatedUrlDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Token Created Successfully</DialogTitle>
          <DialogDescription>
            Copy this URL to share with others:
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input value={url} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={() => onCopy(url)}>
              <IconCopy className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link can be accessed without login.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

