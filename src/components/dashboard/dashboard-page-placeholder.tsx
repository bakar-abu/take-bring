type DashboardPagePlaceholderProps = {
  title: string;
  description: string;
};

export function DashboardPagePlaceholder({
  title,
  description,
}: DashboardPagePlaceholderProps) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-extrabold text-logo-bg sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/60 sm:text-base">
        {description}
      </p>
    </div>
  );
}
