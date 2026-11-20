import TagFilter from "@/components/web_components/Art-Gallery/tagFilter";
import { Suspense } from "react";
import { Gallery, GalleryLoader } from "@/components/web_components/Art-Gallery/gallery"; 
import { getImageCategories } from "@/lib/queries";
export const instant = false;

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string; cursor?: string }>;
}) {
    const { tag, cursor } = await searchParams;
    const AVAILABLE_TAGS = (await getImageCategories()).map(elem=>elem.name)
    return (
        <div className="flex gap-4 sm:gap-16 flex-col sm:flex-row">
            <div className="max-w-full overflow-x-auto sm:overflow-x-visible">
                <TagFilter currentTag={tag} AVAILABLE_TAGS={AVAILABLE_TAGS}/>
            </div>
            <Suspense key={`${tag ?? "all"}-${cursor ?? "first"}`} fallback={<GalleryLoader />}>
                <Gallery tag={tag} cursor={cursor} />
            </Suspense>
        </div>
    );
}