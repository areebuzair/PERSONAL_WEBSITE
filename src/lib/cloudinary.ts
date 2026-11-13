// lib/cloudinary.ts
import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { serverEnv } from "@/data/serverEnv";

cloudinary.config({
  cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
  api_key: serverEnv.CLOUDINARY_API_KEY,
  api_secret: serverEnv.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryImageItem {
  id: string; // public_id
  assetId: string;
  displayName: string;
  uploadedAtUTC: string; // ISO 8601 UTC timestamp (e.g. "2026-11-10T10:25:00Z")
  tags: string[];
  url: string; // Pre-generated f_auto, q_auto URL
  width: number;
  height: number;
}

export interface PaginatedImagesResponse {
  images: CloudinaryImageItem[];
  nextCursor: string | null;
  totalCount: number;
}

export interface PaginationOptions {
  limit?: number;
  nextCursor?: string;
}

/**
 * Generates an optimized Cloudinary URL from a public_id with f_auto and q_auto enabled.
 */
export function generateURLfromID(
  id: string,
  extraTransformations: Record<string, any> = {}
): string {
  return cloudinary.url(id, {
    fetch_format: "auto", // f_auto
    quality: "auto",      // q_auto
    secure: true,
    ...extraTransformations,
  });
}

/**
 * Internal helper to run paginated Cloudinary Search queries
 */
async function executePaginatedSearch(
  expression: string,
  { limit = 20, nextCursor }: PaginationOptions = {}
): Promise<PaginatedImagesResponse> {
  let searchQuery = cloudinary.search
    .expression(expression)
    .with_field("context")
    .with_field("tags")
    .sort_by("created_at", "desc")
    .max_results(limit);

  if (nextCursor) {
    searchQuery = searchQuery.next_cursor(nextCursor);
  }

  const result = await searchQuery.execute();

  const images: CloudinaryImageItem[] = (result.resources || []).map(
    (res: any) => ({
      id: res.public_id,
      assetId: res.asset_id,
      displayName:
        res.display_name ||
        res.context?.caption ||
        res.context?.custom?.caption ||
        res.filename ||
        res.public_id,
      // Cloudinary returns created_at in UTC ISO format; new Date().toISOString() guarantees strict UTC
      uploadedAtUTC: new Date(res.created_at).toISOString(),
      tags: res.tags || [],
      url: generateURLfromID(res.public_id),
      width: res.width,
      height: res.height,
    })
  );

  return {
    images,
    nextCursor: result.next_cursor ?? null,
    totalCount: result.total_count ?? 0,
  };
}

/**
 * 1. Fetch paginated images from a specific folder
 */
export async function getImagesByFolder(
  folder: string,
  options?: PaginationOptions
): Promise<PaginatedImagesResponse> {
  const safeFolder = folder.replace(/"/g, '\\"');
  const expression = `resource_type:image AND (asset_folder="${safeFolder}" OR folder="${safeFolder}")`;

  return executePaginatedSearch(expression, options);
}

/**
 * 2. Fetch paginated images from a specific folder filtered by tag(s)
 */
export async function getImagesByFolderAndTag(
  folder: string,
  tag: string | string[],
  options?: PaginationOptions
): Promise<PaginatedImagesResponse> {
  const safeFolder = folder.replace(/"/g, '\\"');
  const tagList = Array.isArray(tag) ? tag : [tag];

  // Builds tag filter: requires all passed tags
  const tagExpression = tagList
    .map((t) => `tags="${t.replace(/"/g, '\\"')}"`)
    .join(" AND ");

  const expression = `resource_type:image AND (asset_folder="${safeFolder}" OR folder="${safeFolder}") AND (${tagExpression})`;

  return executePaginatedSearch(expression, options);
}