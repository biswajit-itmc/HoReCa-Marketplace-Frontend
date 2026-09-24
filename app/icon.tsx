import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const FOREST = '#2E6F40';
const BEIGE = '#EDE8D0';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: FOREST,
          borderRadius: 7,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 3L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
            stroke={BEIGE}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M9 21V13H15V21"
            stroke={BEIGE}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
