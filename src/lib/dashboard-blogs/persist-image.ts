import crypto from "crypto";

export type BlogImagePersistenceResult = {
  storagePath: string;
  publicUrl: string;
  fileData: Buffer;
};

/** Public URL served by /api/images/[id] — skips Next/Vercel image optimization. */
export function buildBlogImagePublicUrl(imageId: string) {
  return `/api/images/${imageId}`;
}

export function buildBlogImageFileName() {
  return `${Date.now()}-${crypto.randomUUID()}.webp`;
}

export function prepareBlogImagePersistence(
  webpBuffer: Buffer,
  imageId: string,
): BlogImagePersistenceResult {
  return {
    storagePath: `database:blog_image_assets/${imageId}`,
    publicUrl: buildBlogImagePublicUrl(imageId),
    fileData: webpBuffer,
  };
}
