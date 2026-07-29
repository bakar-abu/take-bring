import { notFound } from "next/navigation";
import { BlogEditorPanel } from "@/components/dashboard/blog-editor-panel";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

// Same editor UI as /tb-dashboard/blogs/create-new — edit mode.
export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;

  if (!id || id === "create-new") {
    notFound();
  }

  return <BlogEditorPanel blogId={id} />;
}
