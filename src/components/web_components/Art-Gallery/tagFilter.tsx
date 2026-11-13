// app/admin/gallery/TagFilter.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";

const AVAILABLE_TAGS = ["blender", "ambigram"] as const;

export default function TagFilter({ currentTag }: { currentTag?: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleTagChange = (selectedTag: string) => {
        const params = new URLSearchParams();
        if (selectedTag) {
            params.set("tag", selectedTag);
        }
        // Intentionally omit `cursor` so changing the tag resets to the first page
        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    };

    return (
        <fieldset className="flex items-center gap-4 my-4">
            <legend className="text-sm font-medium mr-2">Filter by Tag:</legend>

            {/* "All" option to clear the tag filter */}
            <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                    type="radio"
                    name="tag"
                    value=""
                    checked={!currentTag}
                    onChange={() => handleTagChange("")}
                />
                <span>All</span>
            </label>

            {AVAILABLE_TAGS.map((t) => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <input
                        type="radio"
                        name="tag"
                        value={t}
                        checked={currentTag === t}
                        onChange={() => handleTagChange(t)}
                    />
                    <span>{t}</span>
                </label>
            ))}
        </fieldset>
    );
}