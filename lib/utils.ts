import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class-value inputs into a merged class name string.
 *
 * @param inputs - Class names and conditional class values to combine
 * @returns The combined class name string with conflicting Tailwind CSS classes resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
