import React from 'react';
import { cn } from '../../lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full max-w-7xl mx-auto px-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

Container.displayName = 'Container';