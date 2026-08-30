import React from "react";
import { cn } from "../../utils";

export interface PillTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const PillTab = React.forwardRef<HTMLButtonElement, PillTabProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "text-button-md py-xs px-md rounded-full transition-colors font-medium border",
          active
            ? "bg-primary text-on-primary border-primary"
            : "bg-canvas text-ink border-hairline hover:bg-surface-soft",
          className,
        )}
        {...props}
      />
    );
  },
);

PillTab.displayName = "PillTab";
