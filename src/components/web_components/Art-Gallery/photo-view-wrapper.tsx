"use client"

import { CloudinaryImageItem } from "@/lib/cloudinary"
import { PhotoProvider, PhotoView } from "react-photo-view"

export function PhotoViewWrapper({ images }: { images: CloudinaryImageItem[] }) {
    return <PhotoProvider>
        <div className="columns-xs w-full">
            {images.map((img) => (
                <PhotoView key={img.id} src={img.url}>
                    <div>
                        <img src={img.thumbnailurl} className="w-full mb-2 skeleton-bg" />
                    </div>
                </PhotoView>
            ))}
        </div>
    </PhotoProvider>
}