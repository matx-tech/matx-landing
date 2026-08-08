/**
 * Caveat box styles keyed by stage tone — shared by the evidence loop and
 * the problem section so the same data-driven caveats render identically.
 */
export const CAVEAT_STYLES: Record<string, string> = {
  info: 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-surface dark:border-blue-400/40',
  success:
    'text-green-800 bg-green-50 border-green-200 dark:text-success-strong dark:bg-surface dark:border-success-border',
};
