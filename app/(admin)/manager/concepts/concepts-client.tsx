"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
import { useContentList, useDeleteContent, type ContentItem } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash, IconDotsVertical } from "@tabler/icons-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function ConceptsClient() {
    const { data: items, isLoading, error } = useContentList("concept");
    const deleteMutation = useDeleteContent();
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

    const columns: ColumnDef<ContentItem>[] = useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Tiêu đề",
                cell: ({ row }) => <span className="font-medium text-sm">{row.original.title}</span>,
            },
            {
                accessorKey: "category",
                header: "Danh mục",
                cell: ({ row }) => (
                    <Badge variant="secondary">
                        {row.original.category?.displayName || row.original.category?.name || "N/A"}
                    </Badge>
                ),
            },
            {
                accessorKey: "isActive",
                header: "Trạng thái",
                cell: ({ row }) => (
                    <Badge variant={row.original.isActive ? "default" : "outline"}>
                        {row.original.isActive ? "Active" : "Inactive"}
                    </Badge>
                ),
            },
            {
                accessorKey: "_createdAt",
                header: "Ngày tạo",
                cell: ({ row }) => new Date(row.original._createdAt).toLocaleDateString("vi-VN"),
            },
            {
                id: "actions",
                header: "Thao tác",
                cell: ({ row }) => {
                    const item = row.original;
                    const studioUrl = `/studio/structure/concepts;${item._id}`;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <IconDotsVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(studioUrl, "_blank")}>
                                    <IconPencil className="mr-2 size-4" />
                                    Sửa trong Studio
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <IconTrash className="mr-2 size-4" />
                                    Xóa bài viết
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Lỗi: {(error as Error).message}
                </div>
            )}

            <DataTable
                data={items || []}
                columns={columns}
                filterKey="title"
                filterPlaceholder="Tìm kiếm tiêu đề..."
                showAddButton={true}
                onAdd={() => window.open("/studio/structure/concepts", "_blank")}
                addLabel="Thêm bài viết mới"
                showColumnCustomizer={true}
                showSearch={true}
                showPagination={true}
                selectable={false}
                draggable={false}
            />

            {isLoading && <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>}

            <AlertDialog
                open={!!selectedItem}
                onOpenChange={(open) => !open && setSelectedItem(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa bài viết &quot;<strong>{selectedItem?.title}</strong>&quot;?
                            Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                if (selectedItem) {
                                    deleteMutation.mutate(selectedItem._id, {
                                        onSettled: () => setSelectedItem(null),
                                    });
                                }
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Đang xóa..." : "Xác nhận xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
