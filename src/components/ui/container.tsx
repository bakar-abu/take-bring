import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article" | "main";
};

export function Container({
  className,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return <Component className={cn("container-content", className)} {...props} />;
}
