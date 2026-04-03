import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EmbedPage({ params }: { params: { id: string; lang: string } }) {
  const roast = await prisma.roast.findUnique({
    where: { id: params.id },
    select: { globalScore: true, url: true, isPaid: true },
  });

  if (!roast || !roast.isPaid) notFound();

  const scoreColor = roast.globalScore >= 8 ? '#22C55E' : roast.globalScore >= 5 ? '#F97316' : '#EF4444';

  return (
    <html lang={params.lang}>
      <head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width" /></head>
      <body style={{ margin: 0, padding: 0, background: 'transparent', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <a
          href={`https://roastmysite.com/${params.lang}/roast/${params.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '280px', height: '120px', padding: '16px 20px', boxSizing: 'border-box',
            background: '#13131A', border: '1px solid rgba(249,115,22,0.35)',
            borderRadius: '12px', textDecoration: 'none', color: '#F8FAFC',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>
              🔥 Roasted by Roast My Site
            </div>
            <div style={{ fontSize: '12px', color: '#CBD5E1', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{roast.url}</div>
            <div style={{ fontSize: '10px', color: '#475569' }}>roastmysite.com</div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0, marginLeft: '12px' }}>
            <div style={{ fontSize: '44px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{roast.globalScore}</div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>/10</div>
          </div>
        </a>
      </body>
    </html>
  );
}
