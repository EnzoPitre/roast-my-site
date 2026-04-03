import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = parseInt(searchParams.get('score') || '0', 10);
  const url = searchParams.get('url') || 'your-site.com';
  const lang = searchParams.get('lang') || 'en';

  const scoreColor = score >= 8 ? '#22C55E' : score >= 5 ? '#F97316' : '#EF4444';
  const displayUrl = url.length > 40 ? url.slice(0, 40) + '…' : url;
  const cta = lang === 'fr' ? 'Obtenez votre audit gratuit →' : 'Get your free roast →';
  const label = lang === 'fr' ? 'Score global' : 'Global score';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0A0A0F',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.25), transparent 70%)',
          filter: 'blur(80px)',
        }} />
        {/* Bottom gradient bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '6px',
          background: 'linear-gradient(90deg, #F97316, #EA580C)',
        }} />

        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '28px', fontWeight: 900, color: '#F97316' }}>Roast</span>
          <span style={{ fontSize: '28px', fontWeight: 900, color: '#F8FAFC', marginLeft: '6px' }}>My Site</span>
          <span style={{ fontSize: '20px', marginLeft: '10px' }}>🔥</span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '60px', width: '100%' }}>
          {/* Left: URL */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {lang === 'fr' ? 'Site audité' : 'Site audited'}
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#F8FAFC', lineHeight: 1.2 }}>
              {displayUrl}
            </div>
            <div style={{ fontSize: '20px', color: '#94A3B8', marginTop: '16px', fontStyle: 'italic' }}>
              {lang === 'fr'
                ? 'Audit IA brutal — 7 dimensions analysées'
                : 'Brutal AI audit — 7 dimensions scored'}
            </div>
          </div>

          {/* Right: Score */}
          {score > 0 && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: '#13131A', border: '2px solid rgba(249,115,22,0.3)',
              borderRadius: '24px', padding: '32px 40px',
            }}>
              <div style={{ fontSize: '14px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                {label}
              </div>
              <div style={{ fontSize: '100px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ fontSize: '20px', color: '#475569', fontWeight: 600, marginTop: '4px' }}>/ 10</div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '48px', fontSize: '18px', fontWeight: 800,
          color: '#F97316', letterSpacing: '0.02em',
        }}>
          {cta}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
