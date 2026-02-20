import * as React from "react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("grid gap-3", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, checked, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border border-input bg-background/80 px-4 py-3 text-left text-sm transition-all duration-200",
        checked
          ? "border-primary bg-primary/10 shadow-soft"
          : "hover:-translate-y-0.5 hover:border-primary/45 hover:bg-accent/55",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 h-4 w-4 shrink-0 rounded-full border-2 transition-colors",
          checked ? "border-primary bg-primary" : "border-muted-foreground/40"
        )}
      />
      <div className="min-w-0 flex-1">{children}</div>
    </button>
  )
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
