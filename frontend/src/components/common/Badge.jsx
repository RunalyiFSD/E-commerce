import React from 'react';
import { cn } from '../../utils/cn';

const variantStyles = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-300',
  amber: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  brand: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

const dotColors = {
  neutral: 'bg-slate-400',
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  amber: 'bg-indigo-500',
  brand: 'bg-indigo-500',
  danger: 'bg-rose-500',
  purple: 'bg-purple-500',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className,
  ...props
}) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-2xs transition-colors select-none',
        variantStyles[variant] || variantStyles.neutral,
        sizeClasses,
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant] || dotColors.neutral)} />
      )}
      {children}
    </span>
  );
}

export default Badge;
