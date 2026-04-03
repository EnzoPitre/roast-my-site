import type { Resend as ResendType } from 'resend';

let _resend: ResendType | null = null;

function getResend(): ResendType | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Resend } = require('resend') as { Resend: new (key: string) => ResendType };
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface KillListItem {
  rank: number;
  issue: string;
  why: string;
}

interface RoastEmailData {
  userEmail: string;
  userName?: string | null;
  roastId: string;
  roastUrl: string;
  globalScore: number;
  killList: KillListItem[];
  lang: 'en' | 'fr';
}

export async function sendRoastEmail(data: RoastEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const { userEmail, userName, roastId, roastUrl, globalScore, killList, lang } = data;

  const reportUrl = `https://roastmysite.com/${lang}/roast/${roastId}`;
  const scoreColor = globalScore >= 8 ? '#22C55E' : globalScore >= 5 ? '#F97316' : '#EF4444';
  const top3 = killList.slice(0, 3);

  const subject = lang === 'fr'
    ? `🔥 Votre rapport Roast My Site est prêt — Score : ${globalScore}/10`
    : `🔥 Your Roast My Site report is ready — Score: ${globalScore}/10`;

  const greeting = lang === 'fr'
    ? `Bonjour${userName ? ` ${userName}` : ''},`
    : `Hi${userName ? ` ${userName}` : ''},`;

  const auditLine = lang === 'fr'
    ? `L'audit IA de <strong style="color:#F8FAFC">${roastUrl}</strong> est terminé.`
    : `The AI audit of <strong style="color:#F8FAFC">${roastUrl}</strong> is complete.`;

  const ctaLabel = lang === 'fr' ? 'Voir mon rapport complet →' : 'View my full report →';

  const issuesHtml = top3.map(issue => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid rgba(249,115,22,0.08)">
        <div style="color:#F8FAFC;font-size:13px;font-weight:700;margin-bottom:3px">${issue.issue}</div>
        <div style="color:#94A3B8;font-size:12px;line-height:1.5">${issue.why}</div>
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0A0A0F;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">

    <div style="text-align:center;margin-bottom:28px">
      <span style="font-size:1.2rem;font-weight:900;letter-spacing:-0.02em">
        <span style="color:#F97316">Roast</span><span style="color:#F8FAFC"> My Site</span>
      </span>
    </div>

    <div style="background:#13131A;border:1px solid rgba(249,115,22,0.25);border-radius:16px;padding:32px">
      <p style="color:#E2E8F0;font-size:15px;margin:0 0 8px">${greeting}</p>
      <p style="color:#94A3B8;font-size:14px;margin:0 0 24px">${auditLine}</p>

      <div style="text-align:center;padding:20px 0 24px;border-bottom:1px solid rgba(249,115,22,0.1)">
        <div style="font-size:64px;font-weight:900;color:${scoreColor};line-height:1">${globalScore}</div>
        <div style="font-size:14px;color:#64748B;margin-top:2px">/10</div>
        <div style="font-size:10px;color:#475569;text-transform:uppercase;letter-spacing:0.1em;margin-top:6px">Global Score</div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin:20px 0;background:rgba(239,68,68,0.04);border:1px solid rgba(239,68,68,0.15);border-radius:8px;overflow:hidden">
        ${issuesHtml}
      </table>

      <a href="${reportUrl}" style="display:block;text-align:center;background:linear-gradient(180deg,#F97316,#EA580C);color:white;font-weight:700;font-size:14px;padding:14px 24px;border-radius:10px;text-decoration:none">
        ${ctaLabel}
      </a>
    </div>

    <p style="color:#334155;font-size:11px;text-align:center;margin-top:20px">
      Roast My Site · <a href="https://roastmysite.com" style="color:#475569">roastmysite.com</a>
    </p>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Roast My Site <noreply@roastmysite.com>',
      to: userEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error('[email] Failed to send roast summary email:', err);
    // Swallow — email is non-critical, must never break the roast flow
  }
}
