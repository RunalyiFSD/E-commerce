import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS class names with clsx conflict resolution
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
