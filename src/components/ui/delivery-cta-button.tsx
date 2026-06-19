import { Link } from "@/lib/i18n/navigation";
import type { AppPathname } from "@/config/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeliveryCtaButtonProps = {
  label: string;
  shortLabel?: string;
  href?: AppPathname;
  className?: string;
  onClick?: () => void;
};

export function DeliveryCtaButton({
  label,
  shortLabel = "BOOK",
  href = "/kontakt",
  className,
  onClick,
}: DeliveryCtaButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: "primary", size: "md" }),
        "gap-1.5 sm:gap-2 md:px-6 md:text-base",
        className,
      )}
    >
      <i className="ri-truck-line shrink-0 text-base sm:text-lg" aria-hidden />
      <span className="hidden whitespace-nowrap sm:inline">{label}</span>
      <span className="whitespace-nowrap sm:hidden">{shortLabel}</span>
    </Link>
  );
}
