import { Table } from "@tanstack/react-table"
import { IconChevronDown, IconLayoutColumns, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterKey?: string
  filterPlaceholder?: string
  showSearch?: boolean
  showColumnCustomizer?: boolean
  showAddButton?: boolean
  onAdd?: () => void
  addLabel?: string
  trashComponent?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  filterKey,
  filterPlaceholder,
  showSearch = true,
  showColumnCustomizer = true,
  showAddButton = true,
  onAdd,
  addLabel,
  trashComponent,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-3 px-2 sm:px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
      {/* Left: Search */}
      <div className="flex flex-1 items-center gap-2">
        {showSearch && filterKey ? (
          <div className="flex w-full items-center sm:w-auto sm:py-2">
            <Input
              placeholder={filterPlaceholder || "Search..."}
              value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
              onChange={event =>
                table.getColumn(filterKey)?.setFilterValue(event.target.value)
              }
              className="w-full sm:w-56 md:w-72"
            />
          </div>
        ) : null}
        {trashComponent}
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {showColumnCustomizer ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <IconLayoutColumns className="size-4" />
                <span className="hidden md:inline lg:ml-1">Customize columns</span>
                <IconChevronDown className="ml-1 hidden size-3 md:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  column =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        
        {showAddButton && onAdd ? (
          <Button variant="outline" size="sm" onClick={onAdd} className="h-9">
            <IconPlus className="size-4" />
            <span className="hidden md:inline lg:ml-1">
              {addLabel || "Add"}
            </span>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
