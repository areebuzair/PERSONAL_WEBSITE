"use client"

import { CloudinaryImageItem } from "@/lib/cloudinary"
import { FaArrowRotateRight } from "react-icons/fa6";
import { PhotoProvider, PhotoView } from "react-photo-view"

export function PhotoViewWrapper({ images }: { images: CloudinaryImageItem[] }) {
    return <PhotoProvider
        toolbarRender={({ rotate, onRotate }) => {
            return <FaArrowRotateRight size={44} className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)} />;
        }}
    >
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