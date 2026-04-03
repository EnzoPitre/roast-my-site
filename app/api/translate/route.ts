import { NextResponse } from 'next/server';
import { anthropic } from '@/lib/claude';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { roast } = await req.json();

    const payload = {
      summary: roast.summary,
      competitorComparison: roast.competitorComparison,
      topOpportunity: roast.topOpportunity,
      encouragement: roast.encouragement,
      killList: roast.killList,
      fixPlan: roast.fixPlan,
      quickWins: roast.quickWins,
      scores: roast.scores,
    };

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: `You are a professional translator. Translate the following website audit report from English to French.
Rules:
- Keep all URLs, scores (numbers), and technical terms unchanged.
- Only translate the text content (strings).
- Return valid JSON with the exact same structure as the input.
- Do not add any markdown or explanation outside the JSON.`,
      messages: [
        {
          role: 'user',
          content: `Translate this audit report to French:\n\n${JSON.stringify(payload, null, 2)}`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    let text = textContent.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const translated = JSON.parse(text);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
