// Client-only utility — dynamically imported in components

interface RoastData {
  url: string;
  globalScore: number;
  summary: string;
  killList: Array<{ rank: number; issue: string; why: string }>;
  scores: Record<string, { score: number; verdict: string }>;
  fixPlan: { quick?: string[]; medium?: string[]; strategic?: string[] };
  quickWins?: string[];
  encouragement: string;
  createdAt: string;
  conversionEstimate?: string;
  competitorComparison?: string;
  topOpportunity?: string;
}

const DIM_LABELS: Record<string, { en: string; fr: string }> = {
  firstImpression: { en: 'First Impression',         fr: 'Première Impression' },
  visualDesign:    { en: 'Visual Design',             fr: 'Design Visuel' },
  copywriting:     { en: 'Copywriting',               fr: 'Copywriting' },
  trust:           { en: 'Trust & Credibility',       fr: 'Confiance & Crédibilité' },
  ux:              { en: 'Navigation & UX',           fr: 'Navigation & UX' },
  mobile:          { en: 'Mobile Experience',         fr: 'Expérience Mobile' },
  conversion:      { en: 'Conversion Architecture',   fr: 'Architecture de Conversion' },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function scoreColor(n: number): string {
  if (n >= 7) return '#16a34a';
  if (n >= 5) return '#ea580c';
  return '#dc2626';
}

function scoreBg(n: number): string {
  if (n >= 7) return '#dcfce7';
  if (n >= 5) return '#ffedd5';
  return '#fee2e2';
}

// A4 at 96 dpi
const PAGE_W = 794;
const PAGE_H = 1123;
const PAGE_STYLE = `
  width:${PAGE_W}px;
  height:${PAGE_H}px;
  background:#ffffff;
  font-family:Arial,Helvetica,sans-serif;
  overflow:hidden;
  box-sizing:border-box;
  position:relative;
  color:#1a1a1a;
`.replace(/\s+/g, '');

function pageHeader(pageNum: number): string {
  return `
    <div style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:12px 40px;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:#f97316;font-size:13px;font-weight:900;letter-spacing:0.1em;font-family:Arial,sans-serif;">ROAST MY SITE</span>
      <span style="color:#94a3b8;font-size:11px;font-family:Arial,sans-serif;">${pageNum} / 5</span>
    </div>`;
}

function pageFooter(left: string): string {
  return `
    <div style="position:absolute;bottom:0;left:0;right:0;border-top:2px solid #f97316;padding:14px 40px;display:flex;justify-content:space-between;align-items:center;background:#ffffff;box-sizing:border-box;">
      <span style="color:#94a3b8;font-size:11px;font-family:Arial,sans-serif;">${esc(left)}</span>
      <span style="color:#f97316;font-size:11px;font-weight:700;font-family:Arial,sans-serif;">roastmysite.com</span>
    </div>`;
}

function sectionTitle(title: string): string {
  return `
    <div style="display:flex;align-items:center;margin-bottom:20px;">
      <div style="width:4px;height:26px;background:#f97316;border-radius:2px;margin-right:12px;flex-shrink:0;"></div>
      <span style="font-size:21px;font-weight:900;color:#1a1a1a;font-family:Arial,sans-serif;">${esc(title)}</span>
    </div>`;
}

// ── Page 1: Cover ──────────────────────────────────────────────────────────

function buildCoverPage(roast: RoastData, lang: 'en' | 'fr'): string {
  const dateStr = new Date(roast.createdAt).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );
  const cleanUrl = roast.url.replace(/^https?:\/\/(www\.)?/, '');
  const color = scoreColor(roast.globalScore);
  const scoreEntries = Object.values(roast.scores);

  return `<div class="pdf-page" style="${PAGE_STYLE}">
    <!-- Orange header bar -->
    <div style="background:#f97316;height:64px;padding:0 40px;display:flex;align-items:center;justify-content:space-between;">
      <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:0.18em;font-family:Arial,sans-serif;">ROAST REPORT</span>
      <span style="color:rgba(255,255,255,0.75);font-size:12px;font-family:Arial,sans-serif;">roastmysite.com</span>
    </div>

    <div style="padding:44px 40px 110px;">
      <!-- Label -->
      <div style="color:#94a3b8;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:8px;font-family:Arial,sans-serif;">
        ${lang === 'fr' ? 'SITE AUDITÉ' : 'SITE AUDITED'}
      </div>
      <!-- URL -->
      <div style="color:#1a1a1a;font-size:26px;font-weight:900;margin-bottom:6px;word-break:break-all;line-height:1.2;font-family:Arial,sans-serif;">
        ${esc(cleanUrl)}
      </div>
      <!-- Date -->
      <div style="color:#94a3b8;font-size:13px;margin-bottom:56px;font-family:Arial,sans-serif;">${esc(dateStr)}</div>

      <!-- Score box -->
      <div style="text-align:center;margin-bottom:52px;">
        <div style="display:inline-block;border:3px solid #f97316;border-radius:20px;padding:36px 90px;background:#fffaf5;">
          <div style="color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:18px;font-family:Arial,sans-serif;">
            ${lang === 'fr' ? 'SCORE GLOBAL' : 'GLOBAL ROAST SCORE'}
          </div>
          <div style="font-size:104px;font-weight:900;line-height:1;color:${color};font-family:Arial,sans-serif;">
            ${roast.globalScore}
          </div>
          <div style="color:#94a3b8;font-size:22px;font-weight:700;margin-top:6px;font-family:Arial,sans-serif;">/ 10</div>
          ${roast.conversionEstimate ? `
            <div style="margin-top:20px;padding:8px 20px;background:#dcfce7;border-radius:8px;display:inline-block;">
              <span style="color:#16a34a;font-size:13px;font-weight:700;font-family:Arial,sans-serif;">
                ${lang === 'fr' ? 'Conv. estimée' : 'Est. conversion'}: ${esc(roast.conversionEstimate)}
              </span>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Dimension mini-bars -->
      <div>
        <div style="color:#94a3b8;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:10px;font-family:Arial,sans-serif;">
          ${lang === 'fr' ? '7 DIMENSIONS ANALYSÉES' : '7 DIMENSIONS ANALYZED'}
        </div>
        <div style="display:flex;gap:5px;height:10px;">
          ${scoreEntries.map(d => `
            <div style="flex:1;height:10px;background:${scoreColor(d.score)};border-radius:3px;opacity:0.8;"></div>
          `).join('')}
        </div>
      </div>
    </div>

    ${pageFooter(lang === 'fr' ? `Généré le ${dateStr}` : `Generated on ${dateStr}`)}
  </div>`;
}

// ── Page 2: Executive Summary ──────────────────────────────────────────────

function buildSummaryPage(roast: RoastData, lang: 'en' | 'fr'): string {
  return `<div class="pdf-page" style="${PAGE_STYLE}">
    ${pageHeader(2)}
    <div style="padding:32px 40px 110px;">
      ${sectionTitle(lang === 'fr' ? 'Résumé Exécutif' : 'Executive Summary')}

      <p style="color:#374151;font-size:12px;line-height:1.75;margin:0 0 28px;font-family:Arial,sans-serif;">
        ${esc(roast.summary)}
      </p>

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 26px;" />

      <div style="font-size:15px;font-weight:900;color:#1a1a1a;margin-bottom:14px;font-family:Arial,sans-serif;">
        ${lang === 'fr' ? 'Top 3 Problèmes Critiques' : 'Top 3 Critical Issues'}
      </div>

      ${(roast.killList || []).slice(0, 3).map((item, i) => `
        <div style="display:flex;gap:14px;margin-bottom:14px;padding:14px 16px;background:#fafafa;border-radius:10px;border-left:4px solid #f97316;">
          <div style="width:28px;height:28px;background:#f97316;border-radius:50%;color:white;font-size:13px;font-weight:900;text-align:center;line-height:28px;flex-shrink:0;font-family:Arial,sans-serif;">
            ${i + 1}
          </div>
          <div style="flex:1;">
            <div style="font-size:12px;font-weight:700;color:#1a1a1a;margin-bottom:4px;font-family:Arial,sans-serif;">${esc(item.issue)}</div>
            <div style="font-size:11px;color:#6b7280;line-height:1.5;font-family:Arial,sans-serif;">${esc(item.why)}</div>
          </div>
        </div>
      `).join('')}

      ${roast.conversionEstimate ? `
        <div style="margin-top:18px;padding:14px 20px;background:#fff7ed;border-radius:10px;border:1px solid #fed7aa;display:flex;align-items:center;gap:10px;">
          <span style="font-size:12px;font-weight:700;color:#c2410c;font-family:Arial,sans-serif;">
            ${lang === 'fr' ? 'Taux de conversion estimé :' : 'Estimated conversion rate:'}
            <span style="color:#f97316;"> ${esc(roast.conversionEstimate)}</span>
          </span>
        </div>
      ` : ''}
    </div>
    ${pageFooter(lang === 'fr' ? 'Page 2 — Résumé' : 'Page 2 — Summary')}
  </div>`;
}

// ── Page 3: Dimension Scores ───────────────────────────────────────────────

function buildScoresPage(roast: RoastData, lang: 'en' | 'fr'): string {
  const entries = Object.entries(roast.scores);

  return `<div class="pdf-page" style="${PAGE_STYLE}">
    ${pageHeader(3)}
    <div style="padding:32px 40px 110px;">
      ${sectionTitle(lang === 'fr' ? 'Analyse 7 Dimensions' : '7-Dimension Analysis')}

      <table style="width:100%;border-collapse:collapse;font-size:11px;font-family:Arial,sans-serif;">
        <thead>
          <tr style="background:#f8fafc;">
            <th style="text-align:left;padding:10px 12px;color:#6b7280;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;font-family:Arial,sans-serif;">
              ${lang === 'fr' ? 'Dimension' : 'Dimension'}
            </th>
            <th style="text-align:center;padding:10px 12px;color:#6b7280;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;width:72px;font-family:Arial,sans-serif;">
              Score
            </th>
            <th style="text-align:left;padding:10px 12px;color:#6b7280;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;border-bottom:2px solid #e2e8f0;font-family:Arial,sans-serif;">
              Verdict
            </th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(([key, data], i) => {
            const label = DIM_LABELS[key]?.[lang] ?? key;
            const rowBg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
            return `
              <tr style="background:${rowBg};">
                <td style="padding:11px 12px;color:#1a1a1a;font-weight:700;border-bottom:1px solid #f1f5f9;font-family:Arial,sans-serif;">${esc(label)}</td>
                <td style="padding:11px 12px;text-align:center;border-bottom:1px solid #f1f5f9;">
                  <span style="background:${scoreBg(data.score)};color:${scoreColor(data.score)};padding:3px 10px;border-radius:20px;font-weight:900;font-size:12px;font-family:Arial,sans-serif;">
                    ${data.score}/10
                  </span>
                </td>
                <td style="padding:11px 12px;color:#4b5563;font-size:11px;line-height:1.45;border-bottom:1px solid #f1f5f9;font-family:Arial,sans-serif;">${esc(data.verdict)}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>

      ${roast.topOpportunity ? `
        <div style="margin-top:22px;padding:16px 20px;background:#fff7ed;border-radius:10px;border-left:4px solid #f97316;">
          <div style="color:#c2410c;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:7px;font-family:Arial,sans-serif;">
            ${lang === 'fr' ? 'Top Opportunité' : 'Top Opportunity'}
          </div>
          <div style="color:#1a1a1a;font-size:12px;line-height:1.6;font-family:Arial,sans-serif;">${esc(roast.topOpportunity)}</div>
        </div>
      ` : ''}
    </div>
    ${pageFooter(lang === 'fr' ? 'Page 3 — Scores' : 'Page 3 — Dimension Scores')}
  </div>`;
}

// ── Page 4: Fix Plan ───────────────────────────────────────────────────────

function buildFixPlanPage(roast: RoastData, lang: 'en' | 'fr'): string {
  const quick     = roast.fixPlan?.quick     ?? [];
  const medium    = roast.fixPlan?.medium    ?? [];
  const strategic = roast.fixPlan?.strategic ?? [];

  function planSection(icon: string, title: string, items: string[], accentColor: string, bgColor: string): string {
    if (!items.length) return '';
    return `
      <div style="margin-bottom:20px;">
        <div style="background:${bgColor};border-radius:8px;padding:7px 14px;margin-bottom:10px;display:inline-block;">
          <span style="font-size:14px;">${icon}</span>
          <span style="font-size:13px;font-weight:900;color:${accentColor};margin-left:8px;font-family:Arial,sans-serif;">${esc(title)}</span>
        </div>
        ${items.map(item => `
          <div style="display:flex;gap:10px;margin-bottom:6px;padding:8px 12px;border-radius:6px;border-left:3px solid ${accentColor};background:#fafafa;">
            <span style="color:${accentColor};font-size:15px;line-height:1;flex-shrink:0;font-family:Arial,sans-serif;">&#9744;</span>
            <span style="font-size:11px;color:#374151;line-height:1.5;font-family:Arial,sans-serif;">${esc(item)}</span>
          </div>
        `).join('')}
      </div>`;
  }

  return `<div class="pdf-page" style="${PAGE_STYLE}">
    ${pageHeader(4)}
    <div style="padding:32px 40px 110px;">
      ${sectionTitle(lang === 'fr' ? "Votre Plan d'Action" : 'Your Action Plan')}

      ${planSection('&#9889;',
        lang === 'fr' ? 'Victoires Rapides (< 1 heure)' : 'Quick Wins (< 1 hour)',
        quick, '#f97316', '#fff7ed'
      )}
      ${planSection('&#128296;',
        lang === 'fr' ? 'Effort Modéré (1–3 jours)' : 'Medium Effort (1–3 days)',
        medium, '#6b7280', '#f8fafc'
      )}
      ${planSection('&#127919;',
        lang === 'fr' ? 'Stratégique (1 semaine+)' : 'Strategic (1 week+)',
        strategic, '#1e293b', '#f1f5f9'
      )}
    </div>
    ${pageFooter(lang === 'fr' ? "Page 4 — Plan d'Action" : 'Page 4 — Fix Plan')}
  </div>`;
}

// ── Page 5: Final Words ────────────────────────────────────────────────────

function buildFinalPage(roast: RoastData, lang: 'en' | 'fr'): string {
  const tips = lang === 'fr' ? [
    "Corrigez les victoires rapides en premier — elles sont gratuites et immédiates.",
    "Mesurez votre taux de conversion avant et après chaque correctif.",
    "Re-roastez votre site dans 30 jours pour mesurer votre progression.",
  ] : [
    "Fix quick wins first — they're free and often take under an hour.",
    "Measure your conversion rate before and after each fix.",
    "Re-roast your site in 30 days to track your improvement.",
  ];

  return `<div class="pdf-page" style="${PAGE_STYLE}">
    ${pageHeader(5)}
    <div style="padding:32px 40px 110px;">
      ${sectionTitle(lang === 'fr' ? 'Mot de la Fin' : 'Final Words')}

      <!-- Encouragement quote -->
      <div style="padding:20px 24px;background:#fffaf5;border-left:4px solid #f97316;border-radius:0 10px 10px 0;margin-bottom:24px;">
        <div style="font-size:13px;font-style:italic;color:#374151;line-height:1.75;font-family:Arial,sans-serif;">
          &ldquo;${esc(roast.encouragement)}&rdquo;
        </div>
      </div>

      ${roast.competitorComparison ? `
        <div style="padding:14px 18px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:22px;">
          <div style="font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:7px;font-family:Arial,sans-serif;">
            ${lang === 'fr' ? 'Comparaison Concurrents' : 'Competitor Comparison'}
          </div>
          <div style="font-size:12px;color:#374151;line-height:1.6;font-family:Arial,sans-serif;">${esc(roast.competitorComparison)}</div>
        </div>
      ` : ''}

      <!-- What's next -->
      <div style="font-size:15px;font-weight:900;color:#1a1a1a;margin-bottom:12px;font-family:Arial,sans-serif;">
        ${lang === 'fr' ? "Prochaines étapes" : "What's next?"}
      </div>

      ${tips.map((tip, i) => `
        <div style="display:flex;gap:12px;margin-bottom:10px;padding:10px 14px;background:#f8fafc;border-radius:8px;align-items:flex-start;">
          <div style="width:22px;height:22px;background:#f97316;border-radius:50%;color:white;font-size:11px;font-weight:900;text-align:center;line-height:22px;flex-shrink:0;font-family:Arial,sans-serif;">
            ${i + 1}
          </div>
          <span style="font-size:12px;color:#374151;line-height:1.5;font-family:Arial,sans-serif;">${tip}</span>
        </div>
      `).join('')}

      <!-- CTA box -->
      <div style="margin-top:28px;text-align:center;padding:20px;background:#fff7ed;border-radius:12px;border:1px solid #fed7aa;">
        <div style="font-size:15px;font-weight:900;color:#f97316;margin-bottom:5px;font-family:Arial,sans-serif;">roastmysite.com</div>
        <div style="font-size:12px;color:#6b7280;font-family:Arial,sans-serif;">
          ${lang === 'fr'
            ? "Re-roastez votre site dans 30 jours pour suivre votre progression."
            : "Re-roast your site in 30 days to track your improvement."}
        </div>
      </div>
    </div>
    ${pageFooter(lang === 'fr' ? 'Généré par Roast My Site' : 'Generated by Roast My Site')}
  </div>`;
}

// ── Main export ────────────────────────────────────────────────────────────

export async function generatePdf(roast: RoastData, lang: 'en' | 'fr' = 'en'): Promise<void> {
  const { jsPDF }     = await import('jspdf');
  const html2canvas   = (await import('html2canvas')).default;

  const container = document.createElement('div');
  container.style.cssText = `position:fixed;left:-9999px;top:0;z-index:-9999;width:${PAGE_W}px;`;
  document.body.appendChild(container);

  try {
    container.innerHTML = [
      buildCoverPage(roast, lang),
      buildSummaryPage(roast, lang),
      buildScoresPage(roast, lang),
      buildFixPlanPage(roast, lang),
      buildFinalPage(roast, lang),
    ].join('');

    // Two animation frames so the browser has time to lay out the DOM
    await new Promise<void>(res =>
      requestAnimationFrame(() => requestAnimationFrame(() => res()))
    );

    const pages = Array.from(container.querySelectorAll<HTMLElement>('.pdf-page'));

    const doc  = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pdfW = doc.internal.pageSize.getWidth();
    const pdfH = doc.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: PAGE_W,
        height: PAGE_H,
      });

      if (i > 0) doc.addPage();
      doc.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, 0, pdfW, pdfH);
    }

    const slug = roast.url
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 28);
    doc.save(`${slug}-roast-report.pdf`);

  } finally {
    document.body.removeChild(container);
  }
}
