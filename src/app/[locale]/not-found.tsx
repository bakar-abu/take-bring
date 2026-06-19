import { Link } from "@/lib/i18n/navigation";

export default function LocaleNotFound() {
  return (
    <div className="container-content flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="text-5xl font-bold text-foreground">404</h1>
      <p className="mt-2 text-neutral-500">Page not found</p>
      <Link
        href="/"
        className="mt-6 font-semibold text-primary hover:text-primary-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
