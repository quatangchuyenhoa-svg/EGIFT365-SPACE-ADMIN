"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type TokenFormProps = {
  formPath: string
  formTitle: string
  formCode: string
  formErrors: { path?: string; title?: string; code?: string }
  onChangePath: (v: string) => void
  onChangeTitle: (v: string) => void
  onChangeCode: (v: string) => void
  formCategory: string
  onChangeCategory: (v: string) => void
  onGenerate?: () => void
  showPathHint?: boolean
  showCodeHint?: boolean
}

export function TokenForm({
  formPath,
  formTitle,
  formCode,
  formErrors,
  onChangePath,
  onChangeTitle,
  onChangeCode,
  onGenerate,
  showPathHint = true,
  showCodeHint = true,
  formCategory,
  onChangeCategory,
}: TokenFormProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="path">
          Path <span className="text-destructive">*</span>
        </Label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-sm text-muted-foreground select-none">
            /egift365/
          </span>
          <Input
            id="path"
            placeholder="concepts/slug-here"
            className="pl-[74px]"
            value={formPath}
            onChange={e => {
              onChangePath(e.target.value)
            }}
            aria-invalid={!!formErrors.path}
          />
        </div>
        {formErrors.path && (
          <p className="text-sm text-destructive">{formErrors.path}</p>
        )}
        {showPathHint && (
          <p className="text-xs text-muted-foreground">
            Path must start with concepts/ or knowledge/
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formCategory}
          onChange={e => onChangeCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Kho tri thức">Kho tri thức</option>
          <option value="Kho quan niệm">Kho quan niệm</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Optional title for the token"
          value={formTitle}
          onChange={e => {
            onChangeTitle(e.target.value)
          }}
          aria-invalid={!!formErrors.title}
        />
        {formErrors.title && (
          <p className="text-sm text-destructive">{formErrors.title}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="code">
          Code <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="code"
            placeholder="Leave empty to generate"
            value={formCode}
            onChange={e => {
              onChangeCode(e.target.value)
            }}
            aria-invalid={!!formErrors.code}
          />
          {onGenerate && (
            <Button type="button" variant="outline" onClick={onGenerate}>
              Generate
            </Button>
          )}
        </div>
        {formErrors.code && (
          <p className="text-sm text-destructive">{formErrors.code}</p>
        )}
        {showCodeHint && (
          <p className="text-xs text-muted-foreground">
            Changing the code will invalidate the old link.
          </p>
        )}
      </div>
    </div>
  )
}

