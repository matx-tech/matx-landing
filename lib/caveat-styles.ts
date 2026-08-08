/**
 * Caveat box styles keyed by stage tone — shared by the evidence loop and
 * the problem section so the same data-driven caveats render identically.
 */
export const CAVEAT_STYLES: Record<string, string> = {
  info: 'text-info-strong bg-info-surface border-info-border dark:text-info-strong dark:bg-surface dark:border-info-border',
  success:
    'text-green-800 bg-green-50 border-green-200 dark:text-success-strong dark:bg-surface dark:border-success-border',
};
