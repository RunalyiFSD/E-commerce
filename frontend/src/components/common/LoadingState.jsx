import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function LoadingState({ label = 'Loading...', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3 text-slate-500', className)}>
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      {label && <p className="text-xs font-medium tracking-wide text-slate-600">{label}</p>}
    </div>
  );
}

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-slate-200/80', className)}
      {...props}
    />
  );
}

export default LoadingState;
