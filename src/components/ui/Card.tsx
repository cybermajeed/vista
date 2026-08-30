import React from 'react';
import { cn } from '../../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'feature' | 'feature-yellow' | 'feature-coral' | 'feature-teal' | 'feature-rose' | 'customer-story' | 'pricing' | 'pricing-featured' | 'pricing-enterprise';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'base', ...props }, ref) => {
    const variants = {
      base: 'bg-canvas rounded-xl p-xl border border-hairline-soft',
      feature: 'bg-canvas rounded-xxxl p-xxl border border-hairline-soft',
      'feature-yellow': 'bg-brand-yellow text-primary rounded-xxxl p-xxl',
      'feature-coral': 'bg-coral-light text-primary rounded-xxxl p-xxl',
      'feature-teal': 'bg-teal-light text-primary rounded-xxxl p-xxl',
      'feature-rose': 'bg-brand-rose text-primary rounded-xxxl p-xxl', // Wait, rose-light? Using brand-rose as per design.md, wait it says "rose-light" in docs but brand-rose is defined. Let's use brand-rose
      'customer-story': 'bg-canvas rounded-xxxl p-0 border border-hairline-soft overflow-hidden',
      pricing: 'bg-canvas rounded-xl p-xxl border border-hairline',
      'pricing-featured': 'bg-surface-pricing-featured rounded-xl p-xxl border-2 border-brand-accent',
      'pricing-enterprise': 'bg-primary text-on-primary rounded-xl p-xxl',
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
