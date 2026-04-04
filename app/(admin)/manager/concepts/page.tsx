import { Metadata } from "next";
import ConceptsClient from "@/app/(admin)/manager/concepts/concepts-client";
import { InfoCard } from "@/components/infoCard";
import { getTranslation } from "@/lib/i18n/server";

export const metadata: Metadata = {
    title: "Concepts Base Manager",
    description: "List of articles in Concepts Base",
};

export default async function ConceptsPage() {
    const { t } = await getTranslation();

    return (
        <div className="flex flex-col gap-4 p-6">
            <InfoCard
                title={t('concepts.title')}
                description={t('concepts.desc')}
                className="border-border/60 shadow-sm"
            />
            <ConceptsClient />
        </div>
    );
}
