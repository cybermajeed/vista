import React from 'react';
import { cn } from '../../utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'promo' | 'tag-yellow' | 'tag-purple' | 'tag-coral' | 'success' | 'discount';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'tag-yellow', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center text-caption-bold';
    
    const variants = {
      promo: 'bg-brand-yellow text-primary rounded-full px-[10px] py-[4px]',
      'tag-yellow': 'bg-surface-yellow text-yellow-dark rounded-full px-[10px] py-[4px]',
      'tag-purple': 'bg-surface-pricing-featured text-brand-accent rounded-full px-[10px] py-[4px]',
      'tag-coral': 'bg-coral-light text-coral-dark rounded-full px-[10px] py-[4px]',
      success: 'bg-success-accent text-on-primary rounded-full px-[10px] py-[4px]',
      discount: 'bg-brand-yellow text-primary rounded-sm px-[6px] py-[2px]',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
