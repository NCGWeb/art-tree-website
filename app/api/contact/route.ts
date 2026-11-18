import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { getPageContent } from '@/lib/content';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const resendKey = process.env.RESEND_API_KEY;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!resendKey && (!user || !pass)) {
    return NextResponse.json({ error: 'Mail is not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  // Hidden field real visitors never fill in; bots do. Pretend success.
  if (typeof body.website === 'string' && body.website) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? '').trim().slice(0, 200);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const subject = String(body.subject ?? '').trim().slice(0, 200);
  const message = String(body.message ?? '').trim().slice(0, 5000);
  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Name and a valid email are required' }, { status: 400 });
  }

  const contact = await getPageContent('contact', { fresh: true });
  const to = contact.formRecipients?.length ? contact.formRecipients : contact.emails;

  const finalSubject = subject || contact.form.defaultSubject;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  try {
    if (resendKey) {
      // Resend: the sender must be an address on a domain verified in Resend.
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Art Tree website <enquiries@art-tree.co.in>',
          to,
          reply_to: email,
          subject: finalSubject,
          text,
        }),
      });
      if (!res.ok) throw new Error(`resend ${res.status} ${await res.text()}`);
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
      });
      await transporter.sendMail({
        from: `"Art Tree website" <${user}>`,
        to,
        replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
        subject: finalSubject,
        text,
      });
    }
  } catch (err) {
    console.error('[contact] send failed:', err);
    // TEMP DEBUG: remove once the send works.
    return NextResponse.json({ error: 'Could not send', detail: String((err as Error)?.message).slice(0, 300) }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
