"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
import { useDeleteContent, type ContentItem } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash, IconDotsVertical } from "@tabler/icons-react";
import { client as sanityClient } from "@/sanity/client";
import { useQuery } from "@tanstack/react-query";
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

export function DashboardArticles() {
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
    const deleteMutation = useDeleteContent();

    const { data: articles } = useQuery({
        queryKey: ["recent-articles"],
        queryFn: async () => {
            const query = `*[_type in ["knowledgeItem", "concept"]] | order(_createdAt desc)[0...10] {
        _id,
        _type,
        title,
        "category": category->{name, displayName},
        isActive,
        _createdAt,
        _updatedAt
      }`;
            return await sanityClient.fetch<ContentItem[]>(query);
        },
    });

    const columns: ColumnDef<ContentItem>[] = useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Bài viết gần đây",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{row.original.title}</span>
                        <span className="text-xs text-muted-foreground uppercase">{row.original._type}</span>
                    </div>
                ),
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
                id: "actions",
                header: "Thao tác",
                cell: ({ row }) => {
                    const item = row.original;
                    const studioPath = item._type === 'knowledgeItem' ? 'knowledgeBase' : 'concepts';
                    const studioUrl = `/studio/structure/${studioPath};${item._id}`;

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
                                    Sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <IconTrash className="mr-2 size-4" />
                                    Xóa
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
        <>
            <DataTable
                data={articles || []}
                columns={columns}
                filterKey="title"
                filterPlaceholder="Tìm kiếm bài viết..."
                showPagination={false}
                selectable={false}
            />

            <AlertDialog
                open={!!selectedItem}
                onOpenChange={(open) => !open && setSelectedItem(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa &quot;<strong>{selectedItem?.title}</strong>&quot;?
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
        </>
    );
}
