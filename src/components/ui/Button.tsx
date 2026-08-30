import React from "react";
import { cn } from "../../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "yellow"
    | "blue"
    | "on-dark"
    | "ghost"
    | "icon-circular";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
      primary:
        "!bg-primary !text-white text-button-md py-[12px] px-[24px] rounded-full hover:bg-charcoal",
      yellow:
        "!bg-brand-yellow !text-ink-deep text-button-md py-[12px] px-[24px] rounded-full hover:bg-brand-yellow-deep",
      blue: "!bg-brand-accent !text-white text-button-md py-[12px] px-[24px] rounded-full hover:bg-accent-pressed",
      secondary:
        "!bg-transparent !text-ink border border-hairline-strong text-button-md py-[12px] px-[24px] rounded-full hover:bg-surface-soft",
      "on-dark":
        "!bg-white !text-ink-deep text-button-md py-[12px] px-[24px] rounded-full hover:bg-canvas/90",
      ghost:
        "!bg-transparent !text-ink text-button-md py-[8px] px-[12px] rounded-md hover:bg-surface-soft",
      "icon-circular":
        "!bg-canvas !text-ink border border-hairline w-[36px] h-[36px] rounded-full hover:bg-surface-soft",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
