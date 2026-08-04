import crypto from "crypto";
import sharp from "sharp";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sqlQuery } from "@/lib/db/sql";
import {
  mapBlogImageRow,
  mapBlogRow,
  type BlogImageRow,
  type BlogRow,
} from "@/lib/dashboard-blogs/map";
import {
  buildBlogImageFileName,
  prepareBlogImagePersistence,
} from "@/lib/dashboard-blogs/persist-image";
import {
  isValidBlogSlug,
  slugifyBlogTitle,
} from "@/lib/dashboard-blogs/helpers";
import type {
  BlogEditorInput,
  BlogImageAsset,
  BlogStatus,
  DashboardBlog,
} from "@/lib/dashboard-blogs/types";

const BLOG_SELECT =
  "id, title, slug, excerpt, status, seo_title, seo_description, category, date_label, body_html, cover_image_url, cover_image_asset_id, views_count, published_at, created_at, updated_at" as const;

function normalizeSlug(title: string, slug: string) {
  const raw = slug.trim() || slugifyBlogTitle(title);
  const candidate = raw || "blog-post";
  if (!isValidBlogSlug(candidate) && slug.trim()) {
    throw new Error(
      "Slug must use lowercase letters, numbers, and hyphens only.",
    );
  }
  return candidate;
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string) {
  const supabase = getSupabaseAdmin();
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    let query = supabase.from("blogs").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return candidate;
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function listBlogs(): Promise<DashboardBlog[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapBlogRow(row as BlogRow));
}

export async function getBlogById(id: string): Promise<DashboardBlog | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapBlogRow(data as BlogRow);
}

export async function createBlog(
  input: BlogEditorInput,
  authorId: string,
): Promise<DashboardBlog> {
  if (!input.title.trim()) throw new Error("Blog title is required.");
  if (!input.coverImageUrl.trim()) throw new Error("One image is required.");

  const baseSlug = normalizeSlug(input.title, input.slug);
  const slug = await ensureUniqueSlug(baseSlug);
  const status: BlogStatus = input.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const now = new Date().toISOString();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt.trim(),
      status,
      seo_title: input.seoTitle.trim(),
      seo_description: input.seoDescription.trim(),
      category: input.category.trim(),
      date_label: input.dateLabel.trim(),
      body_html: input.bodyHtml,
      cover_image_url: input.coverImageUrl.trim(),
      cover_image_asset_id: input.coverImageAssetId ?? null,
      views_count: 0,
      author_id: authorId,
      published_at: status === "PUBLISHED" ? now : null,
    })
    .select(BLOG_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapBlogRow(data as BlogRow);
}

export async function updateBlog(
  id: string,
  input: BlogEditorInput,
): Promise<DashboardBlog> {
  const existing = await getBlogById(id);
  if (!existing) throw new Error("Blog not found.");
  if (!input.title.trim()) throw new Error("Blog title is required.");
  if (!input.coverImageUrl.trim()) throw new Error("One image is required.");

  const baseSlug = normalizeSlug(input.title, input.slug);
  const slug = await ensureUniqueSlug(baseSlug, id);
  const status: BlogStatus = input.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const publishedAt =
    status === "PUBLISHED"
      ? existing.publishedAt || new Date().toISOString()
      : null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .update({
      title: input.title.trim(),
      slug,
      excerpt: input.excerpt.trim(),
      status,
      seo_title: input.seoTitle.trim(),
      seo_description: input.seoDescription.trim(),
      category: input.category.trim(),
      date_label: input.dateLabel.trim(),
      body_html: input.bodyHtml,
      cover_image_url: input.coverImageUrl.trim(),
      cover_image_asset_id: input.coverImageAssetId ?? null,
      published_at: publishedAt,
    })
    .eq("id", id)
    .select(BLOG_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapBlogRow(data as BlogRow);
}

export async function updateBlogStatus(
  id: string,
  status: BlogStatus,
): Promise<DashboardBlog> {
  const existing = await getBlogById(id);
  if (!existing) throw new Error("Blog not found.");

  const publishedAt =
    status === "PUBLISHED"
      ? existing.publishedAt || new Date().toISOString()
      : null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blogs")
    .update({ status, published_at: publishedAt })
    .eq("id", id)
    .select(BLOG_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapBlogRow(data as BlogRow);
}

export async function deleteBlog(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listBlogImages(): Promise<BlogImageAsset[]> {
  const result = await sqlQuery<BlogImageRow>(
    `SELECT id, public_url, alt_text, created_at
     FROM blog_image_assets
     ORDER BY created_at DESC`,
  );
  return result.rows.map(mapBlogImageRow);
}

export async function uploadBlogImage(input: {
  file: File;
  uploadedByUserId: string;
  altText?: string | null;
}): Promise<BlogImageAsset> {
  const arrayBuffer = await input.file.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  const imageId = crypto.randomUUID();
  const fileName = buildBlogImageFileName();

  const transformed = await sharp(inputBuffer)
    .rotate()
    .webp({ quality: 80 })
    .toBuffer({ resolveWithObject: true });

  const persistence = prepareBlogImagePersistence(transformed.data, imageId);

  const result = await sqlQuery<BlogImageRow>(
    `INSERT INTO blog_image_assets
      (id, original_file_name, mime_type, storage_path, public_url, width, height, size_bytes, alt_text, uploaded_by_user_id, file_data)
     VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id, public_url, alt_text, created_at`,
    [
      imageId,
      input.file.name || fileName,
      "image/webp",
      persistence.storagePath,
      persistence.publicUrl,
      transformed.info.width ?? null,
      transformed.info.height ?? null,
      transformed.info.size,
      input.altText?.trim() || input.file.name || null,
      input.uploadedByUserId,
      persistence.fileData,
    ],
  );

  const row = result.rows[0];
  if (!row) throw new Error("Unable to store image.");
  return mapBlogImageRow(row);
}

export async function getBlogImageFile(imageId: string): Promise<{
  data: Buffer;
  mimeType: string;
} | null> {
  const result = await sqlQuery<{
    file_data: Buffer | null;
    mime_type: string | null;
  }>(
    `SELECT file_data, mime_type
     FROM blog_image_assets
     WHERE id = $1`,
    [imageId],
  );

  const row = result.rows[0];
  if (!row?.file_data) return null;

  return {
    data: row.file_data,
    mimeType: row.mime_type ?? "image/webp",
  };
}
