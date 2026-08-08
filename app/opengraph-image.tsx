import { ImageResponse } from 'next/og';
import { SITE_META } from '@/lib/content/landing-copy';

export const alt = 'MATx — adaptiivne matemaatikaõpikeskkond Eesti põhikoolidele';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Static OG card, generated at build time. Colors echo the dark theme
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
        background: '#0b1220',
        color: '#ffffff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 88, fontWeight: 700, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#63a0d6' }}>MAT</span>
          <span style={{ color: '#3fa69d' }}>x</span>
        </span>
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
        <div style={{ fontSize: 30, lineHeight: 1.4, color: '#97a4ba' }}>
          {SITE_META.shortDescription}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, color: '#97a4ba' }}>
        matx.ee
        <span style={{ marginLeft: 24, fontSize: 22, color: '#3fa69d' }}>FELLIN HÄKK 2026</span>
      </div>
    </div>,
    size,
  );
}
