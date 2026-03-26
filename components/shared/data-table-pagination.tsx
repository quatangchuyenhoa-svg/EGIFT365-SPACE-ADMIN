import { Table } from "@tanstack/react-table"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Row } from "@tanstack/react-table"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  selectable?: boolean
  onBulkDelete?: (selectedRows: Row<TData>[]) => void
}

export function DataTablePagination<TData>({
  table,
  selectable = true,
  onBulkDelete,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <div className="flex flex-1 items-center gap-2 sm:gap-4">
        {selectable ? (
          <div className="text-muted-foreground hidden flex-1 text-xs sm:text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} rows selected
          </div>
        ) : (
          <div className="flex-1" />
        )}
        {/* Bulk Delete Button */}
        {onBulkDelete && table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(table.getFilteredSelectedRowModel().rows)}
            className="h-9"
          >
            <IconTrash className="size-4" />
            <span className="hidden md:inline lg:ml-1">
              Bulk delete ({table.getFilteredSelectedRowModel().rows.length})
            </span>
            <span className="ml-1 md:hidden">
              {table.getFilteredSelectedRowModel().rows.length}
            </span>
          </Button>
        )}
      </div>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:w-fit lg:gap-8">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-xs font-medium sm:text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
