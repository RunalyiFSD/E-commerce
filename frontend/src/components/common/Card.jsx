import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  children,
  className,
  isGlass = false,
  isHoverable = false,
  ...props
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-200 overflow-hidden',
        isGlass && 'glass-panel border-white/40',
        isHoverable && 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4', className)} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-base font-bold text-slate-900 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-xs text-slate-500 mt-0.5', className)} {...props}>
      {children}
    </p>
  );
};

Card.Body = function CardBody({ children, className, ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
