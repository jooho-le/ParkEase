import * as React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700',
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };
