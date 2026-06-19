import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div>
      {label ? <label htmlFor={inputId}>{label}</label> : null}
      <input
        id={inputId}
        className={cn(className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
