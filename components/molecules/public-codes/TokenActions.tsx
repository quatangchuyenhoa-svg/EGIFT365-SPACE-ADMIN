"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { type PublicAccessToken } from "@/hooks/usePublicAccessTokens"
import { IconDotsVertical, IconPencil, IconTrash, IconCopy } from "@tabler/icons-react"

type TokenActionsProps = {
  token: PublicAccessToken
  onEdit: (token: PublicAccessToken) => void
  onDelete: (code: string) => void
  deletingCode: string | null
  onCopy: (token: PublicAccessToken) => void
}

export function TokenActions({ token, onEdit, onDelete, deletingCode, onCopy }: TokenActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <IconDotsVertical className="size-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(token)}>
          <IconPencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopy(token)}>
          <IconCopy className="size-4" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(token.code)}
          disabled={deletingCode === token.code}
        >
          <IconTrash className="size-4" />
          {deletingCode === token.code ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

