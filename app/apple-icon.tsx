import { ImageResponse } from 'next/og';
import { matxIconSvg } from '@/components/ui/matx-logo';

export const alt = 'MATx';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Apple touch icon: brand tile + stencil x, rasterized at build time from the
// shared matxIconSvg() builder (same source as the favicon, app/icon.tsx).
const ICON_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(matxIconSvg())}`;

/**
 * Generates the Apple touch icon (iOS/desktop Safari home-screen tile).
 *
 * @returns The rendered Apple icon image response.
 */
export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* biome-ignore lint/performance/noImgElement: ImageResponse is static markup — next/image does not render inside it */}
      <img src={ICON_DATA_URI} alt='' width={180} height={180} />
    </div>,
    size,
  );
}
