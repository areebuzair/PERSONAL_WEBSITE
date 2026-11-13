import Image from "next/image";
import LoadingImagePreview from "@/assets/Image Loading Preview.svg"
import Link from "next/link";
import { generateURLfromID, getImagesByFolder, getImagesByFolderAndTag } from "@/lib/cloudinary";

export function GalleryLoader() {
    return <div className="columns-xs w-full">
        {[...Array(6).keys()].map(num => (
            <Image src={LoadingImagePreview} alt="Loading..." loading="eager" key={num} className="w-full mb-2 skeleton-bg" />
        ))}
    </div>
}

export async function Gallery({ tag, cursor }: { tag: string | undefined, cursor: string | undefined }) {
    const FOLDER = "blog_page_artworks";

    const { images, nextCursor, totalCount } = tag
        ? await getImagesByFolderAndTag(FOLDER, tag, { limit: 10, nextCursor: cursor })
        : await getImagesByFolder(FOLDER, { limit: 10, nextCursor: cursor });

    // Build the query object for the Next button so it keeps the current tag
    const nextQueryParams: Record<string, string> = {};
    if (tag) nextQueryParams.tag = tag;
    if (nextCursor) nextQueryParams.cursor = nextCursor;

    return <>
        <div className="columns-xs w-full">
            {images.map((img) => (
                <div key={img.id}>
                    <img src={generateURLfromID(img.id, { width: 300 })} className="w-full mb-2" />
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