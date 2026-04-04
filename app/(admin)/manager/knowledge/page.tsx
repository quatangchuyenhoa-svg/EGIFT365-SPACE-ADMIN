import { Metadata } from "next";
import KnowledgeClient from "@/app/(admin)/manager/knowledge/knowledge-client";
import { InfoCard } from "@/components/infoCard";
import { getTranslation } from "@/lib/i18n/server";

export const metadata: Metadata = {
    title: "Knowledge Base Manager",
    description: "List of articles in Knowledge Base",
};

export default async function KnowledgePage() {
    const { t } = await getTranslation();

    return (
        <div className="flex flex-col gap-4 p-6">
            <InfoCard
                title={t('knowledge.title')}
                description={t('knowledge.desc')}
                className="border-border/60 shadow-sm"
            />
            <KnowledgeClient />
        </div>
    );
}
