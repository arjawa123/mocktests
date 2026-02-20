import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-2.5 w-full overflow-hidden rounded-full border border-border/60 bg-secondary/70",
      className
    )}
    {...props}
  >
    <div
      className="h-full bg-gradient-to-r from-primary via-primary to-info transition-all duration-500 ease-out"
      style={{ width: `${value}%` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
