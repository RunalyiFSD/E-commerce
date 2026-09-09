import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from './Button';

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry,
  className,
}) {
  return (
    <div className={cn('p-6 bg-rose-50/50 border border-rose-200 rounded-2xl flex flex-col items-center text-center gap-3', className)}>
      <div className="p-3 bg-rose-100 rounded-full text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-rose-900">{title}</h4>
        <p className="text-xs text-rose-700 mt-1 max-w-md leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="border-rose-300 text-rose-800 hover:bg-rose-100/60 mt-1"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
