import TagFilter from "@/components/web_components/Art-Gallery/tagFilter";
import { Suspense } from "react";
import { Gallery, GalleryLoader } from "@/components/web_components/Art-Gallery/gallery"; 
export const instant = false;

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string; cursor?: string }>;
}) {
    const { tag, cursor } = await searchParams;

    return (
        <div className="flex gap-16">
            <div className="max-w-full">
                <TagFilter currentTag={tag} />
            </div>
            <Suspense key={`${tag ?? "all"}-${cursor ?? "first"}`} fallback={<GalleryLoader />}>
                <Gallery tag={tag} cursor={cursor} />
            </Suspense>
        </div>
    );
}