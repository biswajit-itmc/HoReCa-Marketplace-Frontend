import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const alt = 'HoReCa Connect — B2B Marketplace for Hospitality';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const FOREST = '#2E6F40';
const FOREST_DARK = '#1F4E2C';
const BEIGE = '#EDE8D0';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: `linear-gradient(135deg, ${FOREST} 0%, ${FOREST_DARK} 100%)`,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(237,232,208,0.08)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -160,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'rgba(237,232,208,0.06)',
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 96,
            height: 96,
            borderRadius: 24,
            background: BEIGE,
            marginBottom: 36,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9L12 3L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
              stroke={FOREST}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 21V13H15V21"
              stroke={FOREST}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            color: BEIGE,
            letterSpacing: -1.5,
          }}
        >
          HoReCa Connect
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 30,
            fontWeight: 400,
            color: 'rgba(237,232,208,0.9)',
          }}
        >
          India's B2B Marketplace for Hospitality
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 44,
            padding: '10px 28px',
            borderRadius: 999,
            background: 'rgba(237,232,208,0.12)',
            border: '1px solid rgba(237,232,208,0.35)',
            color: BEIGE,
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          VERIFIED SUPPLIERS · EQUIPMENT · SUPPLIES
        </div>
      </div>
    ),
    { ...size }
  );
}
