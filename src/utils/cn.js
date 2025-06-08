import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and twMerge to handle Tailwind CSS class conflicts
 * @param {...string} inputs - Class names to be combined
 * @returns {string} - Merged class names with conflicts resolved
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
} 