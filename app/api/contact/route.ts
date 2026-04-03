import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
    if (message.length < 20) {
      return NextResponse.json({ error: 'Message too short.' }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL;
    if (!process.env.RESEND_API_KEY || !contactEmail) {
      // Dev mode: log and succeed silently
      console.log('[Contact Form]', { name, email, subject, message });
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Roast My Site <noreply@roastmysite.com>',
      to: contactEmail,
      replyTo: email,
      subject: `[Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family:system-ui,sans-serif;background:#0A0A0F;color:#F8FAFC;padding:32px;border-radius:12px;max-width:600px">
          <h2 style="color:#F97316;margin-top:0">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94A3B8;width:100px">From:</td><td style="padding:8px 0;color:#F8FAFC">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">Email:</td><td style="padding:8px 0;color:#F97316">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">Subject:</td><td style="padding:8px 0;color:#F8FAFC">${subject}</td></tr>
          </table>
          <div style="margin-top:24px;padding:16px;background:#13131A;border-radius:8px;border:1px solid rgba(249,115,22,0.2)">
            <p style="margin:0;line-height:1.6;color:#CBD5E1;white-space:pre-wrap">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
