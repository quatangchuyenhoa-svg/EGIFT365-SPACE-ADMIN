'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconArrowDown,
  IconArrowsUpDown,
  IconArrowUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function DraggableRow<
  TData extends { id?: UniqueIdentifier; _id?: string | number },
>({
  row,
  onRowClick,
}: {
  row: Row<TData>;
  onRowClick?: (row: Row<TData>) => void;
}) {
  // Use row index as fallback ID to avoid Math.random() in render
  const sortableId = React.useMemo(() => {
    return row.original._id || row.original.id || `row-${row.index}`;
  }, [row.original._id, row.original.id, row.index]);

  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: sortableId,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      onClick={e => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-stop-row-click]')) return;
        onRowClick?.(row);
      }}
      style={{
        cursor: onRowClick ? 'pointer' : undefined,
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<
  TData extends { id?: UniqueIdentifier; _id?: string | number },
>({
  data: initialData,
  columns,
  renderActions,
  filterKey,
  filterPlaceholder,
  onAdd,
  addLabel,
  onRowClick,
  trashComponent,
  onBulkDelete,
  draggable = false,
  selectable = true,
  showSearch = true,
  showColumnCustomizer = true,
  showAddButton = true,
  showPagination = true,
  renderExpandedContent,
  meta,
}: {
  data: TData[];
  columns: ColumnDef<TData>[];
  renderActions?: (row: Row<TData>) => React.ReactNode;
  filterKey?: string;
  filterPlaceholder?: string;
  onAdd?: () => void;
  addLabel?: string;
  onRowClick?: (row: Row<TData>) => void;
  trashComponent?: React.ReactNode;
  onBulkDelete?: (selectedRows: Row<TData>[]) => void;
  draggable?: boolean;
  selectable?: boolean;
  showSearch?: boolean;
  showColumnCustomizer?: boolean;
  showAddButton?: boolean;
  showPagination?: boolean;
  renderExpandedContent?: (row: Row<TData>) => React.ReactNode;
  meta?: Record<string, unknown>;
}) {
  const [data, setData] = React.useState(() => initialData);

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // Kiểm tra nếu có controlled pagination từ meta
  const isManualPagination = meta?.pageCount !== undefined;
  const initialPagination = meta?.pagination
    ? (meta.pagination as { pageIndex: number; pageSize: number })
    : { pageIndex: 0, pageSize: 10 };

  const [pagination, setPagination] = React.useState(initialPagination);

  // Update pagination khi meta.pagination thay đổi (cho server-side pagination)
  React.useEffect(() => {
    if (meta?.pagination) {
      setPagination(meta.pagination as { pageIndex: number; pageSize: number });
    }
  }, [meta?.pagination]);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Helper function để lấy unique ID (memoized)
  const getRowId = React.useCallback((row: TData): string => {
    return (row._id || row.id || Math.random().toString()).toString();
  }, []);

  const dataIds = React.useMemo<string[]>(
    () => data?.map(getRowId) || [],
    [data, getRowId]
  );

  const dragColumn: ColumnDef<TData> = {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => (
      <div data-stop-row-click>
        <DragHandle id={getRowId(row.original)} />
      </div>
    ),
  };

  const selectColumn: ColumnDef<TData> = {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center" data-stop-row-click>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center" data-stop-row-click>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const actionsCol: ColumnDef<TData> | null = renderActions
    ? {
        id: 'actions',
        cell: ({ row }) => (
          <div
            onClick={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
            data-stop-row-click
          >
            {renderActions(row as Row<TData>)}
          </div>
        ),
      }
    : null;

  const allCols = [
    ...(draggable ? [dragColumn as ColumnDef<TData>] : []),
    ...(selectable ? [selectColumn as ColumnDef<TData>] : []),
    ...columns,
    ...(actionsCol ? [actionsCol] : []),
  ];
  // Handler cho pagination change
  type PaginationState = { pageIndex: number; pageSize: number };
  const handlePaginationChange = React.useCallback(
    (updater: React.SetStateAction<PaginationState>) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newPagination);

      // Nếu có custom handler từ meta, gọi nó
      if (meta?.onPaginationChange) {
        (
          meta.onPaginationChange as (
            updater: React.SetStateAction<PaginationState>
          ) => void
        )(updater);
      }
    },
    [pagination, meta]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: allCols,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: row => getRowId(row),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Chỉ sử dụng client-side pagination nếu không có manual pagination
    ...(isManualPagination
      ? {
          manualPagination: true,
          pageCount: meta.pageCount as number,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData(data => {
        const oldIndex = dataIds.indexOf(active.id.toString());
        const newIndex = dataIds.indexOf(over.id.toString());
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <DataTableToolbar
        table={table}
        filterKey={filterKey}
        filterPlaceholder={filterPlaceholder}
        showSearch={showSearch}
        showColumnCustomizer={showColumnCustomizer}
        showAddButton={showAddButton}
        onAdd={onAdd}
        addLabel={addLabel}
        trashComponent={trashComponent}
      />
      <div className="relative flex flex-col gap-4 overflow-x-auto px-2 sm:px-4 lg:px-6">
        <div className="min-w-full overflow-x-auto rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table className="min-w-full">
              <TableHeader className="bg-muted sticky top-0 z-[1]">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : header.column.getCanSort() ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-1 select-none"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getIsSorted() === 'asc' ? (
                                <IconArrowUp className="size-3" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <IconArrowDown className="size-3" />
                              ) : (
                                <IconArrowsUpDown className="size-3 opacity-60" />
                              )}
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8 [&_tr]:bg-white dark:[&_tr]:bg-card">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map(row => {
                      const expandedRows =
                        (meta as { expandedRows?: Set<string> })?.expandedRows ||
                        new Set();
                      const isExpanded = expandedRows.has(row.id);
                      return (
                        <React.Fragment key={row.id}>
                          <DraggableRow row={row} onRowClick={onRowClick} />
                          {isExpanded && renderExpandedContent && (
                            <TableRow>
                              <TableCell colSpan={allCols.length} className="p-0">
                                <div className="border-t bg-muted/30 p-4">
                                  {renderExpandedContent(row)}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={allCols.length} className="h-24 text-center">
                      No results
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
          {showPagination && (
            <DataTablePagination
              table={table}
              selectable={selectable}
              onBulkDelete={onBulkDelete}
            />
          )}
      </div>
    </div>
  );
}
