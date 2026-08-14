import type { SVGProps } from 'react';

// MATx wordmark — glyphs extracted from matx-logo.svg (repo root). The source
// is a black-backdrop export: a solid-black glyph layer under the white glyph
// group. Only the white group is reused — it is a complete, colorable wordmark
// (counters included). Two-tone by default (M/A/T in brand primary, x in brand
// accent — the site's existing lockup); pass `mono` for a single currentColor
// mark. Paths were cut from the source file verbatim; edit the SVG, not this
// file, and re-extract.
const MATX_M =
  'M197 309 l0 -179 38.4 0 38.4 0 3.5 6.3 c5.6 10 19.9 35.5 43.7 77.7 12.2 21.7 26.2 46.5 31 55 12.1 21.5 20.6 36.5 24.5 43 1.8 3 6.3 11 10 17.8 3.7 6.7 7 12.2 7.4 12.2 0.3 0 4.9 -8.3 10.2 -18.3 8.8 -16.8 67.4 -126.5 91.3 -171.1 5.6 -10.5 10.5 -19.9 10.9 -20.8 0.6 -1.7 3.4 -1.8 38.7 -1.8 l38 0 0 179 0 179 -39.5 0 -39.5 0 0 -106.7 c0 -89 -0.2 -106.5 -1.3 -105.3 -0.8 0.8 -6.7 11.2 -13.2 23 -6.5 11.8 -13.7 24.9 -16 29 -2.3 4.1 -9.6 17 -16 28.5 -6.5 11.6 -20.3 36 -30.7 54.3 l-19 33.2 -17.6 0 -17.7 -0.1 -10.4 -18.7 c-5.7 -10.3 -22.3 -39.6 -36.9 -65.2 -32.5 -57.1 -38.9 -68.5 -43.8 -77.7 -2.2 -4 -4.2 -7.3 -4.6 -7.3 -0.5 0 -0.8 47.9 -0.8 106.5 l0 106.5 -39.5 0 -39.5 0 0 -179z';
const MATX_A =
  'M605 487.7 c0 -0.4 16.7 -37.7 21.8 -48.7 1.6 -3.6 4.6 -10.3 6.7 -15 2 -4.7 5.6 -12.8 8 -18 2.4 -5.2 9.8 -21.6 16.5 -36.5 6.7 -14.8 13.3 -29.5 14.7 -32.5 1.4 -3 4.3 -9.5 6.5 -14.5 2.2 -4.9 6.2 -13.9 9 -19.9 2.7 -5.9 6.5 -14.3 8.3 -18.5 1.8 -4.2 7.7 -17.3 13 -29.1 5.3 -11.8 16 -35.7 23.7 -53 7.7 -17.3 16.6 -37.3 19.8 -44.5 3.2 -7.1 7.2 -16.1 8.9 -20 l2.9 -7 46.7 0 46.6 0 4 9 c2.2 5 5.8 12.8 7.9 17.5 2.1 4.7 11 24.7 19.8 44.5 8.7 19.8 21.1 47.5 27.5 61.5 18.4 40.9 21.1 46.7 36.7 81.5 8.1 18.2 22.5 50.1 32 71 24.2 53.3 32 70.8 32 71.7 0 0.4 -19.9 0.8 -44.2 0.8 l-44.3 0 -8.8 -20.3 c-4.9 -11.1 -12.3 -28.2 -16.5 -37.9 l-7.7 -17.8 -73.2 0 -73.2 0 2.6 -5.7 c1.4 -3.2 7.9 -18.2 14.4 -33.3 l11.9 -27.5 44 -0.3 c24.2 -0.1 44 -0.4 44 -0.5 0 -0.5 -4.8 -12.4 -6.5 -16.2 -0.8 -1.6 -3.2 -7.5 -5.5 -13 -2.3 -5.5 -4.5 -10.9 -5 -12 -2.5 -5.4 -15.1 -35 -26 -61 -6.7 -15.9 -12.3 -29.1 -12.5 -29.3 -0.1 -0.1 -2.6 5.5 -5.5 12.5 -2.9 7 -9.5 22.9 -14.7 35.3 -5.2 12.4 -12.5 29.5 -16.1 38 -13.9 33 -75.4 176.2 -78.2 182.4 l-3.1 6.6 -44.4 0 c-24.5 0 -44.5 -0.2 -44.5 -0.3z';
const MATX_T =
  'M1089.7 487.3 c-0.4 -0.3 -0.7 -64.5 -0.7 -142.5 l0 -141.8 -61 0 -61 0 0 -36.5 0 -36.5 164.3 0.2 164.2 0.3 0.3 36.3 0.2 36.2 -61 0 -61 0 0 142.5 0 142.5 -41.8 0 c-23 0 -42.2 -0.3 -42.5 -0.7z';
const MATX_X = [
  'M1268.2 487.1 c0.2 -0.6 5.7 -7.2 12.4 -14.8 6.6 -7.6 23.2 -27.1 36.9 -43.3 13.7 -16.2 27.4 -32.4 30.5 -36 3.1 -3.6 11.2 -13 18.1 -21 6.8 -8 17.4 -20.4 23.5 -27.5 12.8 -15 73.2 -86 78.4 -92.3 l3.5 -4.3 41.7 0.3 41.6 0.3 -18 21 c-22.1 25.7 -42.2 49.5 -77.1 91 -2.7 3.3 -11 13 -18.3 21.5 -56.1 65.6 -75.9 88.7 -82.7 96.8 l-7.8 9.2 -41.6 0 c-25.6 0 -41.3 -0.4 -41.1 -0.9z',
  'M1457.4 471.8 c-7.6 -9 -18.2 -21.4 -23.7 -27.6 -8.8 -10 -9.8 -11.4 -8.6 -13 0.8 -0.9 9.3 -10.9 18.9 -22.1 9.6 -11.2 18.4 -21.5 19.5 -22.8 l2 -2.5 3.3 4.1 c1.8 2.2 10.9 12.9 20.3 23.8 33.9 39.3 39.6 45.9 52.2 60.5 7 8.2 12.7 15.1 12.7 15.3 0 0.3 -18.7 0.5 -41.5 0.5 l-41.4 0 -13.7 -16.2z',
  'M1349.9 345.3 c-3.5 -4.3 -9.8 -11.6 -13.9 -16.4 -4.1 -4.7 -12.4 -14.4 -18.5 -21.5 -6 -7.1 -19.3 -22.6 -29.5 -34.4 -10.2 -11.8 -19.1 -22.3 -19.9 -23.2 -1.3 -1.7 0.8 -1.8 40.5 -1.8 l41.9 0.1 4.4 5.5 c2.4 3 13.1 15.6 23.7 28 15.3 17.9 19.2 22.9 18.5 24.2 -1.1 1.9 -33.7 40.1 -38 44.5 l-2.7 2.8 -6.5 -7.8z',
];

// Per-glyph geometry in cap-height units (1 = 359 of the source canvas).
// Keeps per-glyph renders (hero animation, favicon crops) spacing-exact:
// width/height/gapBefore reproduce the source lockup at any size.
export const MATX_LETTERS = [
  {
    viewBox: '196 130 387 359',
    paths: [MATX_M],
    width: 1.078,
    height: 1,
    gapBefore: 0.547,
    accent: false,
  },
  {
    viewBox: '604 130 415 359',
    paths: [MATX_A],
    width: 1.156,
    height: 1,
    gapBefore: 0.056,
    accent: false,
  },
  {
    viewBox: '966 130 330 359',
    paths: [MATX_T],
    width: 0.919,
    height: 1,
    gapBefore: -0.147,
    accent: false,
  },
  {
    viewBox: '1266 247 290 241',
    paths: MATX_X,
    width: 0.808,
    height: 0.671,
    gapBefore: -0.085,
    accent: true,
  },
] as const;

interface MatxLogoProps extends SVGProps<SVGSVGElement> {
  /** Single-color mark inheriting currentColor instead of the two-tone lockup. */
  mono?: boolean;
}

/**
 * Renders the MATx wordmark as inline SVG (no font, no image request).
 *
 * @param mono - Renders a single-color currentColor mark when true.
 * @returns The wordmark SVG element.
 */
export function MatxLogo({ mono = false, ...props }: MatxLogoProps) {
  const matFill = mono ? 'currentColor' : 'var(--color-action-primary-bg)';
  const xFill = mono ? 'currentColor' : 'var(--color-accent)';
  return (
    <svg viewBox='0 0 1760 608' role='img' aria-label='MATx' focusable='false' {...props}>
      <g fill={matFill}>
        <path d={MATX_M} />
        <path d={MATX_A} />
        <path d={MATX_T} />
      </g>
      <g fill={xFill}>
        {MATX_X.map((d) => (
          <path key={d.slice(0, 16)} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** Raw two-tone wordmark SVG for embed contexts that need markup, not JSX (OG card). */
export function matxLogoSvg(mat: string, x: string): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1760 608">',
    `<g fill="${mat}"><path d="${MATX_M}"/><path d="${MATX_A}"/><path d="${MATX_T}"/></g>`,
    `<g fill="${x}">${MATX_X.map((d) => `<path d="${d}"/>`).join('')}</g>`,
    '</svg>',
  ].join('');
}

/**
 * Raw brand-tile SVG (rounded blue square + white stencil x) for generated
 * icons (app/icon.tsx favicon + app/apple-icon.tsx). Single source of truth
 * for the tile glyph — both generated icons consume this builder.
 */
export function matxIconSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
    '<rect width="64" height="64" rx="14" fill="#1E5A8A"/>',
    `<g fill="#FFFFFF" transform="translate(10, 10) scale(0.133333) translate(-1246, -217)">${MATX_X.map((d) => `<path d="${d}"/>`).join('')}</g>`,
    '</svg>',
  ].join('');
}
