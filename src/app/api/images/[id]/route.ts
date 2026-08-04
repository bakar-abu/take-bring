import { NextRequest, NextResponse } from "next/server";
import { getBlogImageFile } from "@/lib/dashboard-blogs/storage";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Public WebP image serve — bypasses Next/Vercel /_next/image optimization.
 * Dashboard and public pages should use these URLs directly (unoptimized).
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Image id is required." },
      { status: 400 },
    );
  }

  try {
    const image = await getBlogImageFile(id);
    if (!image) {
      return NextResponse.json(
        { ok: false, error: "Image not found." },
        { status: 404 },
      );
    }

    return new NextResponse(new Uint8Array(image.data), {
      status: 200,
      headers: {
        "Content-Type": image.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("GET /api/images/[id]", err);
    return NextResponse.json(
      { ok: false, error: "Could not load image." },
      { status: 500 },
    );
  }
}
