import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({
  className,
  label,
  error,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div>
      {label ? <label htmlFor={textareaId}>{label}</label> : null}
      <textarea
        id={textareaId}
        className={cn(className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
