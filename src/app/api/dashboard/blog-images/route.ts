import { NextResponse } from "next/server";
import { requireDashboardRole, requireDashboardUser } from "@/lib/dashboard-auth";
import {
  listBlogImages,
  uploadBlogImage,
} from "@/lib/dashboard-blogs/storage";

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
    const images = await listBlogImages();
    return NextResponse.json({ ok: true, images });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not list images.";
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

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const altText = formData.get("altText")?.toString() ?? null;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Image file is required." },
        { status: 400 },
      );
    }

    const image = await uploadBlogImage({
      file,
      uploadedByUserId: auth.user.id,
      altText,
    });

    return NextResponse.json({ ok: true, image }, { status: 201 });
  } catch (err) {
    console.error("POST /api/dashboard/blog-images", err);
    const message =
      err instanceof Error ? err.message : "Could not upload image.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
