import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variantStyles = {
  primary: 'bg-amazon-blue hover:bg-amazon-light_blue text-white shadow-sm focus:ring-slate-800',
  amber: 'bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold shadow-sm focus:ring-amber-400 border border-amber-500/30',
  orange: 'bg-amazon-orange hover:bg-amazon-gold text-white font-semibold shadow-sm focus:ring-orange-400',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:ring-slate-400',
  outline: 'bg-transparent border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-400',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 focus:ring-slate-400',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
  icon: 'p-2 rounded-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  ...props
}) {
  const disabled = isDisabled || isLoading;

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:transform-none select-none',
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}

export default Button;
