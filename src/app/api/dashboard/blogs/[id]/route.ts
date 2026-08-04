import { NextResponse } from "next/server";
import { requireDashboardRole, requireDashboardUser } from "@/lib/dashboard-auth";
import { getBlogById, updateBlog } from "@/lib/dashboard-blogs/storage";
import type { BlogEditorInput } from "@/lib/dashboard-blogs/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const WRITE_ROLES = ["Admin", "Content Manager"] as const;

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireDashboardUser();
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
  try {
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json(
        { ok: false, error: "Blog not found." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, blog });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load blog.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireDashboardRole(...WRITE_ROLES);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error },
      { status: auth.status },
    );
  }

  const { id } = await context.params;
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
    const blog = await updateBlog(id, {
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
    });
    return NextResponse.json({ ok: true, blog });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not update blog.";
    const status = /not found/i.test(message)
      ? 404
      : /required|slug/i.test(message)
        ? 400
        : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
