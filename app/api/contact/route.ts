import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

import { getPageContent } from '@/lib/content';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
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
  const to = contact.emails;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"Art Tree website" <${user}>`,
      to,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: subject || contact.form.defaultSubject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (err) {
    console.error('[contact] send failed:', err);
    return NextResponse.json({ error: 'Could not send' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
