import Link from "next/link";
import { getImagesByFolder, getImagesByFolderAndTag } from "@/lib/cloudinary";
import TagFilter from "@/components/web_components/Art-Gallery/tagFilter";
import { Suspense } from "react";

export const instant = false;

async function Gallery({ tag, cursor }: { tag: string | undefined, cursor: string | undefined }) {
    const FOLDER = "blog_page_artworks";

    const { images, nextCursor, totalCount } = tag
        ? await getImagesByFolderAndTag(FOLDER, tag, { limit: 10, nextCursor: cursor })
        : await getImagesByFolder(FOLDER, { limit: 10, nextCursor: cursor });

    // Build the query object for the Next button so it keeps the current tag
    const nextQueryParams: Record<string, string> = {};
    if (tag) nextQueryParams.tag = tag;
    if (nextCursor) nextQueryParams.cursor = nextCursor;

    return <>
        <div className="grid grid-cols-3 gap-4">
            {images.map((img) => (
                <div key={img.id} className="border p-4 rounded-lg space-y-2">
                    <img
                        src={img.url}
                        alt={img.displayName}
                        className="w-full h-48 object-cover rounded"
                    />
                    <h3 className="font-semibold">{img.displayName}</h3>
                    <time className="block text-xs text-gray-400" dateTime={img.uploadedAtUTC}>
                        {img.uploadedAtUTC}
                    </time>
                </div>
            ))}
        </div>

        {/* Render Next button only if nextCursor is not null */}
        {nextCursor && (
            <div className="pt-4">
                <Link
                    href={{
                        pathname: "/art",
                        query: nextQueryParams,
                    }}
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                    Next →
                </Link>
            </div>
        )}
    </>
}

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string; cursor?: string }>;
}) {
    const { tag, cursor } = await searchParams;

    return (
        <div className="space-y-6">
            <div>
                <TagFilter currentTag={tag} />
            </div>
            <Suspense fallback={<div>Loading</div>}>
                <Gallery tag={tag} cursor={cursor} />
            </Suspense>
        </div>
    );
}