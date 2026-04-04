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
import { useTranslation } from "@/lib/i18n/client";

export default function ConceptsClient() {
    const { t } = useTranslation();
    const { data: items, isLoading, error } = useContentList("concept");
    const deleteMutation = useDeleteContent();
    const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

    const columns: ColumnDef<ContentItem>[] = useMemo(
        () => [
            {
                accessorKey: "title",
                header: t('common.title'),
                cell: ({ row }) => <span className="font-medium text-sm">{row.original.title}</span>,
            },
            {
                accessorKey: "category",
                header: t('common.category'),
                cell: ({ row }) => (
                    <Badge variant="secondary">
                        {row.original.category?.displayName || row.original.category?.name || "N/A"}
                    </Badge>
                ),
            },
            {
                accessorKey: "isActive",
                header: t('common.status'),
                cell: ({ row }) => (
                    <Badge variant={row.original.isActive ? "default" : "outline"}>
                        {row.original.isActive ? t('common.active') : t('common.inactive')}
                    </Badge>
                ),
            },
            {
                accessorKey: "_createdAt",
                header: t('common.created_at'),
                cell: ({ row }) => new Date(row.original._createdAt).toLocaleString(),
            },
            {
                id: "actions",
                header: t('common.actions'),
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
                                    {t('content.edit_in_studio')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <IconTrash className="mr-2 size-4" />
                                    {t('content.delete_article')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [t]
    );

    return (
        <div className="flex flex-col gap-4">
            {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {t('common.error')}: {(error as Error).message}
                </div>
            )}

            <DataTable
                data={items || []}
                columns={columns}
                filterKey="title"
                filterPlaceholder={t('content.search_placeholder')}
                showAddButton={true}
                onAdd={() => window.open("/studio/structure/concepts", "_blank")}
                addLabel={t('content.add_new')}
                showColumnCustomizer={true}
                showSearch={true}
                showPagination={true}
                selectable={false}
                draggable={false}
            />

            {isLoading && <p className="text-sm text-muted-foreground">{t('common.loading')}</p>}

            <AlertDialog
                open={!!selectedItem}
                onOpenChange={(open) => !open && setSelectedItem(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('content.confirm_delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('content.confirm_delete_desc', { title: selectedItem?.title })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
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
                            {deleteMutation.isPending ? t('common.deleting') : t('common.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
