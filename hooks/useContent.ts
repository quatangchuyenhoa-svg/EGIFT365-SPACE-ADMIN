"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { client as sanityClient } from "@/sanity/client";
import { toast } from "react-hot-toast";

export type ContentItem = {
    _id: string;
    _type: "knowledgeItem" | "concept";
    title: string;
    slug?: { current: string };
    category?: { name?: string; displayName?: string };
    isActive: boolean;
    order: number;
    _createdAt: string;
    _updatedAt: string;
};

/**
 * Hook to list content from Sanity
 */
export function useContentList(type: "knowledgeItem" | "concept") {
    return useQuery({
        queryKey: ["content", type],
        queryFn: async () => {
            const query = `*[_type == "${type}"] | order(order asc, _createdAt desc) {
        _id,
        _type,
        title,
        slug,
        "category": category->{name, displayName},
        isActive,
        order,
        _createdAt,
        _updatedAt
      }`;
            const data = await sanityClient.fetch<ContentItem[]>(query);
            return data;
        },
    });
}

/**
 * Hook to delete content
 */
export function useDeleteContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/admin/content/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message);
            return data;
        },
        onSuccess: () => {
            toast.success("Xóa bài viết thành công!");
            queryClient.invalidateQueries({ queryKey: ["content"] });
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Xóa bài viết thất bại");
        },
    });
}
