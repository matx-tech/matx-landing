import { ImageResponse } from 'next/og';
import { matxIconSvg } from '@/components/ui/matx-logo';

export const alt = 'MATx';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

// Generated from the shared matxIconSvg() builder (same glyph paths as the
// apple icon) — single source of truth, no static SVG to drift. Rasterized
// to PNG at build time so every favicon consumer renders it.
const ICON_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(matxIconSvg())}`;

/**
 * Generates the site favicon: brand tile + stencil-cut x.
 *
 * @returns The rendered favicon image response.
 */
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* biome-ignore lint/performance/noImgElement: ImageResponse is static markup — next/image does not render inside it */}
      <img src={ICON_DATA_URI} alt='' width={64} height={64} />
    </div>,
    size,
  );
}
