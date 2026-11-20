// app/admin/upload/actions.ts
"use server";

import { serverEnv } from "@/data/serverEnv";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { verifyLoggedInStatus } from "./verify-auth";

cloudinary.config({
    cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
    api_key: serverEnv.CLOUDINARY_API_KEY,
    api_secret: serverEnv.CLOUDINARY_API_SECRET,
});

export type UploadState = {
    success?: boolean;
    error?: string;
    imageUrl?: string;
    publicId?: string;
};

export async function uploadArtwork(
    prevState: UploadState,
    formData: FormData
): Promise<UploadState> {

    await verifyLoggedInStatus();

    try {
        const file = formData.get("image") as File | null;
        const displayName = (formData.get("displayName") as string)?.trim();
        const tags = formData.getAll("tags") as string[];

        if (!file || file.size === 0) {
            return { error: "Please select an image file to upload." };
        }

        if (!displayName) {
            return { error: "Please enter an image display name." };
        }

        // Convert File to Buffer for Cloudinary upload_stream
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Hardcoded target folder
        const TARGET_FOLDER = "blog_page_artworks";

        const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    // Supports both Dynamic Folder mode (asset_folder) and Fixed Folder mode (folder)
                    asset_folder: TARGET_FOLDER,
                    folder: TARGET_FOLDER,
                    // Sets the Display Name in Cloudinary Media Library
                    display_name: displayName,
                    // Also stores display_name in contextual metadata for easy retrieval
                    context: { caption: displayName, alt: displayName },
                    // Attaches selected checkbox tags
                    tags: tags,
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) reject(error);
                    else resolve(result);
                }
            );

            stream.end(buffer);
        });

        return {
            success: true,
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        };
    } catch (err: any) {
        console.error("Cloudinary upload error:", err);
        return {
            error: err?.message || "Failed to upload image to Cloudinary.",
        };
    }
}