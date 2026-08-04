import { BlogEditorPanel } from "@/components/dashboard/blog-editor-panel";
import { requireNavAccess } from "@/lib/dashboard-require-nav";

export default async function CreateBlogPage() {
  await requireNavAccess("blogs");
  return <BlogEditorPanel />;
}
