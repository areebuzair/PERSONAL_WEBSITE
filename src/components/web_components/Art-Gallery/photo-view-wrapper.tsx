"use client"

import { CloudinaryImageItem } from "@/lib/cloudinary"
import { FaArrowRotateRight } from "react-icons/fa6";
import { PhotoProvider, PhotoView } from "react-photo-view"

function RotateButton({ rotate, onRotate }: { rotate: number, onRotate: (rotate: number) => void }) {
    return <button type="button" aria-label="Rotate image clockwise" className="PhotoView-Slider__toolbarIcon" onClick={() => onRotate(rotate + 90)}>
        <FaArrowRotateRight size={24} />
    </button>
}

export function PhotoViewWrapper({ images }: { images: CloudinaryImageItem[] }) {
    return <PhotoProvider
        toolbarRender={({ rotate, onRotate }) => {
            return <RotateButton rotate={rotate} onRotate={onRotate} />;
        }}
    >
        <div className="columns-xs w-full">
            {images.map((img) => (
                <PhotoView key={img.id} src={img.url}>
                    <button type="button" className="block w-full">
                        <img src={img.thumbnailurl} alt={img.displayName} width={img.width} height={img.height} className="w-full mb-2 skeleton-bg" loading="lazy"/>
                    </button>
                </PhotoView>
            ))}
        </div>
    </PhotoProvider>
}