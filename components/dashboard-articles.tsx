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
import { useTranslation } from "@/lib/i18n/client";

export function DashboardArticles() {
    const { t } = useTranslation();
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
                header: t('dashboard.recent_articles'),
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{row.original.title}</span>
                        <span className="text-xs text-muted-foreground uppercase">{row.original._type}</span>
                    </div>
                ),
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
                id: "actions",
                header: t('common.actions'),
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
                                    {t('common.edit')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <IconTrash className="mr-2 size-4" />
                                    {t('common.delete')}
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
        <>
            <DataTable
                data={articles || []}
                columns={columns}
                filterKey="title"
                filterPlaceholder={t('content.search_placeholder')}
                showPagination={false}
                selectable={false}
            />

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
        </>
    );
}
