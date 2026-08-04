import { notFound } from "next/navigation";
import { BlogEditorPanel } from "@/components/dashboard/blog-editor-panel";
import { requireNavAccess } from "@/lib/dashboard-require-nav";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  await requireNavAccess("blogs");
  const { id } = await params;

  if (!id || id === "create-new") {
    notFound();
  }

  return <BlogEditorPanel blogId={id} />;
}
