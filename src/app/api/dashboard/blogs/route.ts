import { NextResponse } from "next/server";
import { requireDashboardRole, requireDashboardUser } from "@/lib/dashboard-auth";
import {
  createBlog,
  deleteBlog,
  listBlogs,
  updateBlogStatus,
} from "@/lib/dashboard-blogs/storage";
import type { BlogEditorInput, BlogStatus } from "@/lib/dashboard-blogs/types";

const WRITE_ROLES = ["Admin", "Content Manager"] as const;

export async function GET() {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  try {
    const blogs = await listBlogs();
    return NextResponse.json({ ok: true, blogs });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not list blogs.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireDashboardRole(...WRITE_ROLES);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  let body: Partial<BlogEditorInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  try {
    const blog = await createBlog(
      {
        title: typeof body.title === "string" ? body.title : "",
        slug: typeof body.slug === "string" ? body.slug : "",
        excerpt: typeof body.excerpt === "string" ? body.excerpt : "",
        status: body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        seoTitle: typeof body.seoTitle === "string" ? body.seoTitle : "",
        seoDescription:
          typeof body.seoDescription === "string" ? body.seoDescription : "",
        category: typeof body.category === "string" ? body.category : "",
        dateLabel: typeof body.dateLabel === "string" ? body.dateLabel : "",
        bodyHtml: typeof body.bodyHtml === "string" ? body.bodyHtml : "",
        coverImageUrl:
          typeof body.coverImageUrl === "string" ? body.coverImageUrl : "",
        coverImageAssetId: body.coverImageAssetId ?? null,
      },
      auth.user.id,
    );
    return NextResponse.json({ ok: true, blog }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not create blog.";
    const status = /required|slug/i.test(message) ? 400 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireDashboardRole(...WRITE_ROLES);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  let body: { blogId?: string; status?: BlogStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (!body.blogId || (body.status !== "DRAFT" && body.status !== "PUBLISHED")) {
    return NextResponse.json(
      { ok: false, error: "blogId and status are required." },
      { status: 400 },
    );
  }

  try {
    const blog = await updateBlogStatus(body.blogId, body.status);
    return NextResponse.json({ ok: true, blog });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not update blog status.";
    const status = /not found/i.test(message) ? 404 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireDashboardRole(...WRITE_ROLES);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  let body: { blogId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  if (!body.blogId) {
    return NextResponse.json(
      { ok: false, error: "blogId is required." },
      { status: 400 },
    );
  }

  try {
    await deleteBlog(body.blogId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not delete blog.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
