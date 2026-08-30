import React from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'bg-canvas text-ink border rounded-md px-sm py-[10px] h-[44px] w-full focus:outline-none transition-colors',
          error 
            ? 'border-brand-red-dark focus:border-brand-red-dark focus:ring-1 focus:ring-brand-red-dark' 
            : 'border-hairline-strong focus:border-brand-accent focus:ring-1 focus:ring-brand-accent',
          'disabled:opacity-50 disabled:bg-surface-soft placeholder:text-muted',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
