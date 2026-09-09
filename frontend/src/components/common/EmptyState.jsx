import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '../../utils/cn';

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No Items Found',
  description = 'There are no items to display right now.',
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto', className)}>
      <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4 shadow-2xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
