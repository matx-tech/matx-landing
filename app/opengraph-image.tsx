import { ImageResponse } from 'next/og';
import { matxLogoSvg } from '@/components/ui/matx-logo';
import { SITE_META } from '@/lib/content/landing-copy';

export const alt = 'MATx — adaptiivne matemaatikaõpikeskkond Eesti põhikoolidele';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Real wordmark as an inline SVG data URI (two-tone on transparent, echoing
// the light card background). Satori rasterizes it at build time.
const LOGO_DATA_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  matxLogoSvg('#1e5a8a', '#0e6f68'),
)}`;

// Static OG card, generated at build time. Colors echo the light theme
/**
 * Generates the MATx-branded Open Graph image.
 *
 * @returns The rendered Open Graph image response.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '88px 96px',
        background: '#ffffff',
        color: '#0b1220',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* biome-ignore lint/performance/noImgElement: ImageResponse is static markup — next/image does not render inside it */}
        <img src={LOGO_DATA_URI} alt='' width={420} height={145} style={{ marginTop: -20 }} />
        <div
          style={{
            display: 'flex',
            height: 8,
            width: 180,
            borderRadius: 4,
            marginLeft: 40,
            marginTop: 18,
            background: 'linear-gradient(135deg, #1e5a8a, #0e6f68)',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 880 }}>
        <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.15 }}>{SITE_META.title}</div>
        <div style={{ fontSize: 30, lineHeight: 1.4, color: '#4b5563' }}>
          {SITE_META.shortDescription}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: '#4b5563' }}>
        matx.ee
        <span style={{ marginLeft: 24, fontSize: 22, color: '#0e6f68' }}>FELLIN HÄKK 2026</span>
      </div>
    </div>,
    size,
  );
}
